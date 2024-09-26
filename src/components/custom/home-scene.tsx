import * as THREE from 'three'
import { Vector3 } from 'three'
import { Perf } from 'r3f-perf'
import { useRef, useMemo } from 'react'
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import {
  Environment,
  Clouds,
  Cloud,
  CameraControls,
  Effects,
} from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon'
import type { InstancedMesh } from 'three'
import { Vec3 } from 'cannon-es'
import { UnrealBloomPass } from 'three-stdlib'
import { useTheme } from '@/components/providers/theme-provider'

extend({ UnrealBloomPass })

declare module '@react-three/fiber' {
  interface ThreeElements {
    unrealBloomPass: ReactThreeFiber.Object3DNode<
      UnrealBloomPass,
      typeof UnrealBloomPass
    >
  }
}

export const Rig = () => {
  const vec = new Vector3()
  return useFrame(({ camera, pointer }) => {
    vec.set(pointer.x * 0.5, pointer.y * 0.25, camera.position.z)
    camera.position.lerp(vec, 0.025)
    camera.lookAt(0, 0, 0)
  })
}

export const Env = () => {
  const { theme } = useTheme()

  return (
    <Environment
      preset={theme === 'dark' ? 'night' : 'dawn'}
      background
      resolution={256}
      backgroundBlurriness={0.6}
    />
  )
}

const CloudsGroup = () => {
  return (
    <Clouds
      material={THREE.MeshBasicMaterial}
      rotation-y={Math.PI / 4}
      castShadow
      receiveShadow
    >
      <Cloud
        speed={0.1}
        volume={1}
        color="lavender"
        segments={5}
        position={[0, 3, 0]}
      />
      <Cloud speed={0.1} color="pink" />
    </Clouds>
  )
}

const Bubbles = () => {
  const number = 100
  const size = 0.5
  const count = useRef(0)

  const [ref, { at }] = useSphere(
    () => ({
      args: [size],
      mass: 1,
      velocity: [-10, 0, -10],
      position: [
        7 + Math.random() - 0.5,
        -2.5 + Math.random() - 0.5,
        7 + Math.random() - 0.5,
      ],
    }),
    useRef<InstancedMesh>(null)
  )

  const windForce = useMemo(() => new Vec3(-1, 0, -1).scale(5), [])

  useFrame(({ clock }) => {
    const time = Math.sin(clock.getElapsedTime()) * 50

    if (time > 49) {
      const id = (count.current += 1) % number
      at(id).velocity.set(-10, 0, -10)
      at(id).position.set(
        7 + Math.random() - 0.5,
        -2.5 + Math.random() - 0.5,
        7 + Math.random() - 0.5
      )
      at(id).applyForce(windForce.toArray(), [0, 0, 0])
    }
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, number]}>
      <sphereGeometry attach="geometry" args={[size]} />
      <meshPhysicalMaterial
        reflectivity={0.5}
        metalness={0.05}
        roughness={0.1}
        clearcoat={1}
        transmission={1}
        thickness={0.1}
      />
    </instancedMesh>
  )
}

const Ring = () => {
  const glow = new THREE.MeshBasicMaterial({
    color: new THREE.Color(7, 1, 2),
    toneMapped: false,
  })

  return (
    <mesh rotation-y={Math.PI / 4} material={glow} position={[0, 1.5, 0]}>
      <torusGeometry args={[5, 0.1, 5, 100]} />
    </mesh>
  )
}

const Scene = () => {
  return (
    <>
      <Ring />
      <CloudsGroup />
      <Physics gravity={[0, 1, 0]}>
        <Bubbles />
      </Physics>
      <Effects disableGamma>
        <unrealBloomPass threshold={0.1} strength={0.2} radius={0.1} />
      </Effects>
      <CameraControls />
      <axesHelper args={[30]} />
      <gridHelper args={[30]} />
      <Perf position={'top-left'} />
    </>
  )
}

export default Scene
