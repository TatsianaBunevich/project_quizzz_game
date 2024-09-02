import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

interface ModalProps extends React.ComponentProps<'dialog'> {
  isModal: boolean
}

const Modal = ({ isModal, children }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [isModal])

  return (
    <dialog className={styles.modal} ref={ref}>
      {children}
    </dialog>
  )
}

export default Modal
