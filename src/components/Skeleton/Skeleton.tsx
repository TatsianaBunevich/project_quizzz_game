import styles from './Skeleton.module.css'

interface SkeletonProps extends React.ComponentProps<'span'> {
  width: string
  height: string
}

const Skeleton = ({ width, height, className }: SkeletonProps) => {
  const style = {
    width,
    height,
  }

  return (
    <span
      className={`${className ?? ''} ${styles.skeleton}`}
      style={style}
    ></span>
  )
}

export default Skeleton
