import { useFrame, type MeshProps } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { type Mesh, Color } from 'three'
import { oklch2rgb } from '../util/oklch2rgb'

function getThemeColors() {
  const compStyle = getComputedStyle(document.documentElement)
  const primary = compStyle.getPropertyValue('--p')
  const secondary = compStyle.getPropertyValue('--s')
  return [primary, secondary]
}

export function Box(props: MeshProps) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh>(null!)
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const [materialColors, setMaterialColors] = useState<string[]>(
    getThemeColors()
  )

  const materialColor = useMemo(() => {
    if (materialColors.length === 0) return new Color()
    const color = hovered ? materialColors[1] : materialColors[0]
    const lch = color.split(' ').map(val => parseFloat(val))
    const [r, g, b] = oklch2rgb(lch)
    return new Color(r, g, b)
  }, [hovered, materialColors])

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_, delta) => (meshRef.current.rotation.x += delta))

  useEffect(() => {
    const observer = new MutationObserver(muts => {
      if (muts[0].attributeName === 'data-theme') {
        setMaterialColors(getThemeColors())
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      childList: false,
      characterData: false,
    })
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={event => setActive(!active)}
      onPointerOver={event => setHover(true)}
      onPointerOut={event => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={materialColor} />
    </mesh>
  )
}
