'use client'

import { useEffect, useRef, useState } from 'react'
import { Renderer, Camera, RenderTarget, Geometry, Program, Mesh, Color, Vec2, Box, NormalProgram, Post, Texture } from 'ogl'

const fragment = /* glsl */ `
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tFluid;
    uniform sampler2D tImage;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
        vec3 fluid = texture2D(tFluid, vUv).rgb;
        vec2 uv = vUv - fluid.rg * 0.0002;

        // Use the user's image instead of showing fluid on half the screen
        vec4 image = texture2D(tImage, uv);
        gl_FragColor = image;

        // Apply fluid distortion effect
        // gl_FragColor = mix(texture2D(tMap, uv), vec4(fluid * 0.1 + 0.5, 1), step(0.5, vUv.x));

        // Oscillate between fluid values and the distorted scene
        // gl_FragColor = mix(texture2D(tMap, uv), vec4(fluid * 0.1 + 0.5, 1), smoothstep(0.0, 0.7, sin(uTime)));
    }
`

const baseVertex = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
        vUv = uv;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(position, 0, 1);
    }
`

const clearShader = /* glsl */ `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`

const splatShader = /* glsl */ `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`

const advectionShader = /* glsl */ `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`

const divergenceShader = /* glsl */ `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`

const curlShader = /* glsl */ `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`

const vorticityShader = /* glsl */ `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`

const pressureShader = /* glsl */ `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`

const gradientSubtractShader = /* glsl */ `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`

interface OGLRenderingContext extends WebGLRenderingContext {
  renderer: Renderer
  canvas: HTMLCanvasElement
  HALF_FLOAT: number
  RGBA16F: number
  RG16F: number
  R16F: number
  RG: number
  RED: number
}

const FluidSimulation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [carouselImage, setCarouselImage] = useState<string | null>(null)
  const defaultImage = 'https://res.cloudinary.com/dgus6y6lm/image/upload/v1750953716/canva13_wu1dsc.png'

  useEffect(() => {
    // Fetch carousel images
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('https://portfolio-backend-six-ruby.vercel.app/api/carausel')
        const data = await response.json()
        if (data && data.length > 0) {
          // Get the first image URL from the carousel items
          setCarouselImage(data[0].imageUrl)
        }
      } catch (error) {
        console.error('Error fetching carousel images:', error)
      }
    }

    fetchCarouselImages()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ dpr: 1 })
    const gl = renderer.gl as OGLRenderingContext
    container.appendChild(gl.canvas)
    gl.clearColor(0.098, 0.098, 0.141, 1.0)

    const camera = new Camera(gl, { fov: 35 })
    camera.position.set(0, 1, 5)
    camera.lookAt([0, 0, 0])

    const post = new Post(gl)

    // Load the user image
    const imageTexture = new Texture(gl)
    const img = new Image()
    img.crossOrigin = 'anonymous' // Enable CORS
    img.onload = () => {
      imageTexture.image = img
      // Start rendering once the image is loaded
      requestAnimationFrame(update)
    }
    img.onerror = () => {
      // If the carousel image fails to load, use the default image
      img.src = defaultImage
    }
    // Use carousel image if available, otherwise use default
    img.src = carouselImage || defaultImage

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
      post.resize()
    }
    window.addEventListener('resize', resize, false)
    resize()

    // Helper functions for larger device support
    function getSupportedFormat(gl: OGLRenderingContext, internalFormat: number, format: number, type: number) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
          default:
            return null
        }
      }

      return { internalFormat, format }
    }

    function supportRenderTextureFormat(gl: OGLRenderingContext, internalFormat: number, format: number, type: number) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
      if (status != gl.FRAMEBUFFER_COMPLETE) return false
      return true
    }

    // Helper to create a ping-pong FBO pairing for simulating on GPU
    function createDoubleFBO(gl: OGLRenderingContext, { width, height, wrapS, wrapT, minFilter = gl.LINEAR, magFilter = minFilter, type, format, internalFormat, depth }: {
      width: number
      height: number
      wrapS?: number
      wrapT?: number
      minFilter?: number
      magFilter?: number
      type?: number
      format?: number
      internalFormat?: number
      depth?: boolean
    }) {
      const options = { width, height, wrapS, wrapT, minFilter, magFilter, type, format, internalFormat, depth }
      const fbo = {
        read: new RenderTarget(gl, options),
        write: new RenderTarget(gl, options),
        swap: () => {
          const temp = fbo.read
          fbo.read = fbo.write
          fbo.write = temp
        },
      }
      return fbo
    }

    // Resolution of simulation
    const simRes = 128
    const dyeRes = 512

    // Main inputs to control look and feel of fluid
    const iterations = 3
    const densityDissipation = 0.97
    const velocityDissipation = 0.98
    const pressureDissipation = 0.8
    const curlStrength = 20
    const radius = 0.2

    // Common uniform
    const texelSize = { value: new Vec2(1 / simRes, 1 / simRes) }

    // Get supported formats and types for FBOs
    const supportLinearFiltering = gl.renderer.extensions[`OES_texture_${gl.renderer.isWebgl2 ? `` : `half_`}float_linear`]
    const halfFloat = gl.renderer.isWebgl2 ? gl.HALF_FLOAT : gl.renderer.extensions['OES_texture_half_float'].HALF_FLOAT_OES

    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST
    let rgba, rg, r

    if (gl.renderer.isWebgl2) {
      rgba = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloat)
      rg = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloat)
      r = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloat)
    } else {
      rgba = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      rg = rgba
      r = rgba
    }

    // Create fluid simulation FBOs
    const density = createDoubleFBO(gl, {
      width: dyeRes,
      height: dyeRes,
      type: halfFloat,
      format: rgba?.format,
      internalFormat: rgba?.internalFormat,
      minFilter: filtering,
      depth: false,
    })

    const velocity = createDoubleFBO(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: rg?.format,
      internalFormat: rg?.internalFormat,
      minFilter: filtering,
      depth: false,
    })

    const pressure = createDoubleFBO(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    const divergence = new RenderTarget(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    const curl = new RenderTarget(gl, {
      width: simRes,
      height: simRes,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    // Geometry to be used for the simulation programs
    const triangle = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })

    // Create fluid simulation programs
    const clearProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: clearShader,
        uniforms: {
          texelSize,
          uTexture: { value: null },
          value: { value: pressureDissipation },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const splatProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: splatShader,
        uniforms: {
          texelSize,
          uTarget: { value: null },
          aspectRatio: { value: 1 },
          color: { value: new Color() },
          point: { value: new Vec2() },
          radius: { value: radius / 100 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const advectionProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: advectionShader,
        uniforms: {
          texelSize,
          dyeTexelSize: { value: new Vec2(1 / dyeRes) },
          uVelocity: { value: null },
          uSource: { value: null },
          dt: { value: 0.016 },
          dissipation: { value: 1 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const divergenceProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: divergenceShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const curlProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: curlShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const vorticityProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: vorticityShader,
        uniforms: {
          texelSize,
          uVelocity: { value: null },
          uCurl: { value: null },
          curl: { value: curlStrength },
          dt: { value: 0.016 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const pressureProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: pressureShader,
        uniforms: {
          texelSize,
          uPressure: { value: null },
          uDivergence: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    const gradientSubtractProgram = new Mesh(gl, {
      geometry: triangle,
      program: new Program(gl, {
        vertex: baseVertex,
        fragment: gradientSubtractShader,
        uniforms: {
          texelSize,
          uPressure: { value: null },
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    })

    interface Splat {
      x: number
      y: number
      dx: number
      dy: number
    }

    const splats: Splat[] = []

    // Create handlers to get mouse position and velocity
    const isTouchCapable = 'ontouchstart' in window
    if (isTouchCapable) {
      window.addEventListener('touchstart', updateMouse, false)
      window.addEventListener('touchmove', updateMouse, false)
    } else {
      window.addEventListener('mousemove', updateMouse, false)
    }

    const lastMouse = new Vec2()
    let isFirstMouseMove = true
    function updateMouse(e: MouseEvent | TouchEvent) {
      let x: number
      let y: number

      if ('touches' in e) {
        x = e.touches[0].pageX
        y = e.touches[0].pageY
      } else {
        x = (e as MouseEvent).pageX
        y = (e as MouseEvent).pageY
      }

      if (isFirstMouseMove) {
        isFirstMouseMove = false
        lastMouse.set(x, y)
        return
      }

      const deltaX = x - lastMouse.x
      const deltaY = y - lastMouse.y

      lastMouse.set(x, y)

      if (Math.abs(deltaX) || Math.abs(deltaY)) {
        splats.push({
          x: x / gl.renderer.width,
          y: 1 - y / gl.renderer.height,
          dx: deltaX * 5,
          dy: deltaY * -5,
        })
      }
    }

    function splat({ x, y, dx, dy }: Splat) {
      splatProgram.program.uniforms.uTarget.value = velocity.read.texture
      splatProgram.program.uniforms.aspectRatio.value = gl.renderer.width / gl.renderer.height
      splatProgram.program.uniforms.point.value.set(x, y)
      splatProgram.program.uniforms.color.value.set(dx, dy, 1)

      gl.renderer.render({
        scene: splatProgram,
        target: velocity.write,
        sort: false,
        update: false,
      })
      velocity.swap()

      splatProgram.program.uniforms.uTarget.value = density.read.texture

      gl.renderer.render({
        scene: splatProgram,
        target: density.write,
        sort: false,
        update: false,
      })
      density.swap()
    }

    // Create initial scene
    const geometry = new Box(gl)
    const mesh = new Mesh(gl, { geometry, program: new NormalProgram(gl) })

    for (let i = 0; i < 20; i++) {
      const m = new Mesh(gl, { geometry, program: new NormalProgram(gl) })
      m.position.set(Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5)
      m.rotation.set(Math.random() * 6.28 - 3.14, Math.random() * 6.28 - 3.14, 0)
      m.scale.set(Math.random() * 0.5 + 0.1)
      m.setParent(mesh)
    }

    const pass = post.addPass({
      fragment,
      uniforms: {
        tFluid: { value: null },
        tImage: { value: imageTexture },
        uTime: { value: 0 },
      },
    })

    function update(t: number) {
      requestAnimationFrame(update)

      gl.renderer.autoClear = false

      for (let i = splats.length - 1; i >= 0; i--) {
        splat(splats.splice(i, 1)[0])
      }

      curlProgram.program.uniforms.uVelocity.value = velocity.read.texture

      gl.renderer.render({
        scene: curlProgram,
        target: curl,
        sort: false,
        update: false,
      })

      vorticityProgram.program.uniforms.uVelocity.value = velocity.read.texture
      vorticityProgram.program.uniforms.uCurl.value = curl.texture

      gl.renderer.render({
        scene: vorticityProgram,
        target: velocity.write,
        sort: false,
        update: false,
      })
      velocity.swap()

      divergenceProgram.program.uniforms.uVelocity.value = velocity.read.texture

      gl.renderer.render({
        scene: divergenceProgram,
        target: divergence,
        sort: false,
        update: false,
      })

      clearProgram.program.uniforms.uTexture.value = pressure.read.texture

      gl.renderer.render({
        scene: clearProgram,
        target: pressure.write,
        sort: false,
        update: false,
      })
      pressure.swap()

      pressureProgram.program.uniforms.uDivergence.value = divergence.texture

      for (let i = 0; i < iterations; i++) {
        pressureProgram.program.uniforms.uPressure.value = pressure.read.texture

        gl.renderer.render({
          scene: pressureProgram,
          target: pressure.write,
          sort: false,
          update: false,
        })
        pressure.swap()
      }

      gradientSubtractProgram.program.uniforms.uPressure.value = pressure.read.texture
      gradientSubtractProgram.program.uniforms.uVelocity.value = velocity.read.texture

      gl.renderer.render({
        scene: gradientSubtractProgram,
        target: velocity.write,
        sort: false,
        update: false,
      })
      velocity.swap()

      advectionProgram.program.uniforms.dyeTexelSize.value.set(1 / simRes)
      advectionProgram.program.uniforms.uVelocity.value = velocity.read.texture
      advectionProgram.program.uniforms.uSource.value = velocity.read.texture
      advectionProgram.program.uniforms.dissipation.value = velocityDissipation

      gl.renderer.render({
        scene: advectionProgram,
        target: velocity.write,
        sort: false,
        update: false,
      })
      velocity.swap()

      advectionProgram.program.uniforms.dyeTexelSize.value.set(1 / dyeRes)
      advectionProgram.program.uniforms.uVelocity.value = velocity.read.texture
      advectionProgram.program.uniforms.uSource.value = density.read.texture
      advectionProgram.program.uniforms.dissipation.value = densityDissipation

      gl.renderer.render({
        scene: advectionProgram,
        target: density.write,
        sort: false,
        update: false,
      })
      density.swap()

      gl.renderer.autoClear = true

      pass.uniforms.tFluid.value = density.read.texture
      pass.uniforms.uTime.value = t * 0.001

      mesh.rotation.y -= 0.0025
      mesh.rotation.x -= 0.005

      post.render({ scene: mesh, camera })
    }

    requestAnimationFrame(update)

    return () => {
      window.removeEventListener('resize', resize)
      if (isTouchCapable) {
        window.removeEventListener('touchstart', updateMouse)
        window.removeEventListener('touchmove', updateMouse)
      } else {
        window.removeEventListener('mousemove', updateMouse)
      }
      container.removeChild(gl.canvas)
      img.remove()
    }
  }, [carouselImage])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}

export default FluidSimulation 