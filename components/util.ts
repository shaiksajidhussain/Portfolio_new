import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform sampler2D map;
  uniform float mapAnisotropy;
  uniform vec2 mapRepeat;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv * mapRepeat;
    uv.x += time;
    vec4 color = texture2D(map, uv);
    gl_FragColor = color;
  }
`

export class MeshSineMaterial extends THREE.ShaderMaterial {
  constructor(parameters = {}) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        map: { value: null },
        mapAnisotropy: { value: 1 },
        mapRepeat: { value: new THREE.Vector2(1, 1) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })

    this.setValues(parameters)
  }
}

// Define custom element types for JSX
interface CustomElements {
  bentPlaneGeometry: {
    [key: string]: unknown;
  };
  meshSineMaterial: {
    [key: string]: unknown;
  };
}

declare global {
  interface JSX {
    IntrinsicElements: CustomElements;
  }
} 