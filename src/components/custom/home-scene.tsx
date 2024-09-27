import * as THREE from 'three'
import { Vector3, TorusGeometry } from 'three'
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
import { Physics, useSphere, Triplet } from '@react-three/cannon'
import type { InstancedMesh } from 'three'
import { Vec3 } from 'cannon-es'
import { UnrealBloomPass } from 'three-stdlib'
import { useTheme } from '@/components/providers/theme-provider'

interface BubblesProps {
  number: number
  size: number
  position: Triplet
}

interface RingProps {
  args: [number?, number?, number?, number?, number?]
  position: Triplet
  rotation: Triplet
}

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
    vec.set(pointer.x * 1.5, pointer.y * 1.5, camera.position.z)
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
    <Clouds material={THREE.MeshBasicMaterial} rotation-y={Math.PI / 4}>
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

const Bubbles = ({ number, size, position }: BubblesProps) => {
  const count = useRef(0)
  const windForce = useMemo(() => new Vec3(-1, 0, -1).scale(1.5), [])
  const [ref, { at }] = useSphere(
    () => ({
      args: [size],
      mass: 0.01,
      velocity: [-5, 0, -5],
      position: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    }),
    useRef<InstancedMesh>(null)
  )

  useFrame(({ clock }) => {
    const time = Math.sin(clock.getElapsedTime()) * 50
    const id = (count.current += 1) % number
    at(id).applyForce(windForce.toArray(), [0, 0, 0])

    if (time > 49) {
      const id = (count.current += 1) % number
      at(id).velocity.set(-5, 0, -5)
      at(id).position.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
    }
  })

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, number]}
      position={position}
    >
      <sphereGeometry args={[size]} />
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

const Ring = ({ args, position, rotation }: RingProps) => {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={args} />
      <meshPhysicalMaterial
        emissive={new THREE.Color(7, 1, 2)}
        envMapIntensity={0.2}
        toneMapped={false}
      />
    </mesh>
  )
}

const Scene = () => {
  return (
    <>
      <Ring
        args={[5, 0.05, 5, 100]}
        position={[0, 1.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <CloudsGroup />
      <Physics gravity={[0, 1, 0]}>
        <Bubbles number={100} size={0.5} position={[7, -4, 7]} />
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
