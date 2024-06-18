import styles from './Skeleton.module.css';

interface SkeletonProps {
    width: string;
    height: string;
    className?: string;
}

const Skeleton = ({ width, height, className }: SkeletonProps) => {
	const style = {
		width,
		height,
	};

	return (
		<span
			className={`${className} ${styles.skeleton}`}
			style={style}>
		</span>
	);
};

export default Skeleton;