import * as THREE from 'three'

export const easing = {
  damp: (current: number, target: number, smoothTime: number, delta: number) => {
    const omega = 2 / smoothTime
    const x = omega * delta
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
    const change = current - target
    const temp = (current + change * exp) * 1000
    return Math.round(temp) / 1000
  },
  damp3: (current: THREE.Vector3, target: THREE.Vector3, smoothTime: number, delta: number) => {
    current.x = easing.damp(current.x, target.x, smoothTime, delta)
    current.y = easing.damp(current.y, target.y, smoothTime, delta)
    current.z = easing.damp(current.z, target.z, smoothTime, delta)
  }
} 