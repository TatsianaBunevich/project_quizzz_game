/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './DisplayedAnswer.module.css';

const DisplayedAnswer = ({text, className}: {text: string; className?: string;}) => {
	switch (text) {
		case 'True':
			return <FontAwesomeIcon className={`${styles.boolean} ${styles.true} ${className ?? ''}`} icon={faCheck} />;
		case 'False':
			return <FontAwesomeIcon className={`${styles.boolean} ${styles.false} ${className ?? ''}`} icon={faXmark} />;
		default:
			return <span dangerouslySetInnerHTML={{__html: text}} />;
	}
};

export default memo(DisplayedAnswer);
