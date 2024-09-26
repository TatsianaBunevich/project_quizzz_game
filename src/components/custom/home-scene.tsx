import * as THREE from 'three'
import { Vector3 } from 'three'
import { Perf } from 'r3f-perf'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Clouds, Cloud, CameraControls } from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon'
import type { InstancedMesh } from 'three'
import { Vec3 } from 'cannon-es'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useTheme } from '@/components/providers/theme-provider'

export const Rig = () => {
  const vec = new Vector3()
  return useFrame(({ camera, pointer }) => {
    vec.set(pointer.x * 30, pointer.y * 30, camera.position.z)
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
        seed={3}
        scale={3}
        volume={10}
        color="lightpink"
        fade={70}
        position={[0, 5, 0]}
      />
      <Cloud
        speed={0.1}
        seed={1}
        scale={5}
        volume={10}
        color="lightpink"
        fade={100}
        position={[0, -10, 0]}
      />
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
        35 + Math.random() - 0.5,
        -15 + Math.random() - 0.5,
        25 + Math.random() - 0.5,
      ],
    }),
    useRef<InstancedMesh>(null)
  )

  const windForce = useMemo(() => new Vec3(-1, 0, -1).scale(10), [])

  useFrame(({ clock }) => {
    const time = Math.sin(clock.getElapsedTime()) * 50

    if (time > 49) {
      const id = (count.current += 1) % number
      at(id).velocity.set(-10, 0, -10)
      at(id).position.set(
        35 + Math.random() - 0.5,
        -25 + Math.random() - 0.5,
        25 + Math.random() - 0.5
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
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <torusGeometry args={[30, 1, 2, 100]} />
      <meshStandardMaterial
        emissive="hotpink"
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  )
}

export const Scene = () => {
  return (
    <>
      <Ring />
      <CloudsGroup />
      <Physics gravity={[0, 1, 0]}>
        <Bubbles />
      </Physics>
      <EffectComposer resolutionScale={0.5}>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.01} />
      </EffectComposer>
      <CameraControls />
      <axesHelper args={[30]} />
      <gridHelper args={[30]} />
      <Perf position={'top-left'} />
    </>
  )
}
