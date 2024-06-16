import styles from './Blobs.module.css'

export const Blobs = ({ play }: { play: boolean }) => {
	if (play) {
		return (
			<>
				<div className={`${styles.playBlob} ${styles.one}`}></div>
				<div className={`${styles.playBlob} ${styles.two}`}></div>
			</>
		)
	} else {
		return (
			<div className={styles.blobsContainer}>
				<div className={`${styles.startBlob} ${styles.one}`}></div>
				<div className={`${styles.startBlob} ${styles.two}`}></div>
				<div className={`${styles.startBlob} ${styles.three}`}></div>
			</div>
		)
	}
}

export default Blobs;