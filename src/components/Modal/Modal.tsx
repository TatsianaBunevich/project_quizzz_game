import useBoundStore from '../../store/boundStore';
import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

const Modal = ({ children }: { children: React.ReactNode }) => {
	const isModal = useBoundStore((state) => state.isModal);
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (isModal) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}
	}, [isModal]);

	return (
		<dialog className={styles.modal} ref={ref}>
			{children}
		</dialog>
	)
}

export default Modal;
