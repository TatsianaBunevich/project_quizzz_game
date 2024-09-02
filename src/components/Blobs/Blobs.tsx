import useBoundStore from '../../store/boundStore'
import styles from './Blobs.module.css'

export const Blobs = () => {
  const isPlay = useBoundStore((state) => state.isPlay)

  if (isPlay) {
    return (
      <>
        <div className={`${styles.playBlob} ${styles.one}`}></div>
        <div className={`${styles.playBlob} ${styles.two}`}></div>
      </>
    )
  } else {
    return (
      <>
        <div className={styles.blobsContainer}>
          <div className={`${styles.startBlob} ${styles.one}`}></div>
          <div className={`${styles.startBlob} ${styles.two}`}></div>
          <div className={`${styles.startBlob} ${styles.three}`}></div>
        </div>
        <div className={styles.blur}></div>
      </>
    )
  }
}

export default Blobs
