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
import { Physics, useSphere, useTrimesh, Triplet } from '@react-three/cannon'
import type { InstancedMesh, Mesh } from 'three'
import { Vec3 } from 'cannon-es'
import { UnrealBloomPass } from 'three-stdlib'
import { useTheme } from '@/components/providers/theme-provider'

interface BubblesProps {
  number: number
  size: number
  velocity: Triplet
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

const Bubbles = ({ number, size, velocity, position }: BubblesProps) => {
  const count = useRef(0)
  const windForce = useMemo(() => new Vec3(-1, 0, -1).scale(5), [])
  const [ref, { at }] = useSphere(
    () => ({
      args: [size],
      mass: 1,
      velocity,
      position,
      material: 'bubble',
      onCollide: handleCollision,
    }),
    useRef<InstancedMesh>(null)
  )

  const handleCollision = (e: { body: { id: number } }) => {
    const id = (count.current += 1) % number
    if (e.body.id === id) {
      resetBubble(id)
    }
  }

  const resetBubble = (id: number) => {
    at(id).velocity.set(...velocity)
    at(id).position.set(...position)
    at(id).applyForce(windForce.toArray(), [0, 0, 0])
  }

  useFrame(({ clock }) => {
    const time = Math.sin(clock.getElapsedTime()) * 50

    if (time > 49) {
      const id = (count.current += 1) % number
      resetBubble(id)
    }
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, number]}>
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
  const geometry = useMemo(() => new TorusGeometry(...args), [args])
  const [ref] = useTrimesh(
    () => ({
      args: [
        geometry.attributes.position.array,
        geometry.index ? geometry.index.array : [],
      ],
      material: 'ring',
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  )

  return (
    <mesh ref={ref}>
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
      <CloudsGroup />
      <Physics gravity={[0, 1, 0]}>
        <Ring
          args={[5, 0.1, 5, 100]}
          position={[0, 1.5, 0]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Bubbles
          number={100}
          size={0.5}
          velocity={[-10, 0, -10]}
          position={[
            7 + Math.random() - 0.5,
            -2.5 + Math.random() - 0.5,
            7 + Math.random() - 0.5,
          ]}
        />
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
