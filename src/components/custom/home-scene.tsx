import * as THREE from 'three'
import { Vector3 } from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Cloud, MeshDistortMaterial } from '@react-three/drei'
import { Physics, useSphere, Triplet } from '@react-three/cannon'
import type { InstancedMesh } from 'three'
import { Vec3 } from 'cannon-es'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useTheme } from '@/components/providers/theme-provider'

interface BubblesProps {
  number: number
  size: number
  position: Triplet
}

interface RingProps {
  args: [number?, number?, number?, number?, number?]
  rotation: Triplet
}

const Rig = () => {
  const vec = new Vector3()
  return useFrame(({ camera, pointer }) => {
    vec.set(pointer.x * 1.5, pointer.y * 1.5, camera.position.z)
    camera.position.lerp(vec, 0.025)
    camera.lookAt(0, 0, 0)
  })
}

const Env = () => {
  const { theme } = useTheme()

  return (
    <>
      <Environment
        path="img/"
        files={
          theme === 'dark'
            ? 'kloppenheim_02_puresky_1k.exr'
            : 'kloofendal_43d_clear_puresky_1k.exr'
        }
        background
        resolution={64}
      />
    </>
  )
}

const CloudsGroup = () => {
  return (
    <Cloud
      speed={0.3}
      volume={5}
      color="lavender"
      position={[0, -0.5, 0]}
      fade={20}
      rotation-y={Math.PI / 4}
    />
  )
}

const Bubbles = ({ number, size, position }: BubblesProps) => {
  const count = useRef(0)
  const windForce = useMemo(() => new Vec3(-1, 0, -1).scale(0.5), [])
  const [bubbleRef, { at }] = useSphere(
    () => ({
      args: [size],
      mass: 0.01,
      velocity: [-5, 0, -5],
      position: [
        Math.random() * -1 - 0.5,
        Math.random() - 0.5,
        Math.random() * -1 - 0.5,
      ],
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
        Math.random() * -1 - 0.5,
        Math.random() - 0.5,
        Math.random() * -1 - 0.5
      )
    }
  }, 2)

  return (
    <instancedMesh
      ref={bubbleRef}
      args={[undefined, undefined, number]}
      position={position}
    >
      <MeshDistortMaterial
        specularColor="red"
        reflectivity={0.5}
        roughness={0.1}
        clearcoat={1}
        transmission={1}
        thickness={0.1}
      />
      <sphereGeometry args={[size, 32, 32]} />
    </instancedMesh>
  )
}

const Ring = ({ args, rotation }: RingProps) => {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={args} />
      <meshStandardMaterial
        emissive={new THREE.Color(7, 1, 2)}
        envMapIntensity={0.01}
        toneMapped={false}
      />
      <EffectComposer>
        <Bloom intensity={0.1} />
      </EffectComposer>
    </mesh>
  )
}

const Scene = () => {
  const memoizedCloudsGroup = useMemo(() => <CloudsGroup />, [])
  return (
    <>
      <Ring args={[5, 0.05, 5, 100]} rotation={[0, Math.PI / 4, 0]} />
      {memoizedCloudsGroup}
      <Physics gravity={[0, 1, 0]}>
        <Bubbles number={15} size={0.5} position={[7, -4, 7]} />
      </Physics>
      <directionalLight position={[10, -10, 10]} intensity={10} color="pink" />
    </>
  )
}

const HomeScene = () => {
  return (
    <>
      <Scene />
      <Rig />
      <Env />
    </>
  )
}

export default HomeScene
