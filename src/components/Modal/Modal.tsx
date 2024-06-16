import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
	isOpen: boolean;
	children: React.ReactNode;
}

const Modal = ({ isOpen, children }: ModalProps) => {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (isOpen) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}
	}, [isOpen]);

	return (
		<dialog className={styles.modal} ref={ref}>
			{children}
		</dialog>
	)
}

export default Modal;