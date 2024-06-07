import React from 'react';
import styles from './Blob.module.css';
import { BlobProps } from '../../types';

const Blob: React.FC<BlobProps> = ({ theme, position, width, height }) => {

	const blobClasses = `${styles.blob} ${styles[theme]} ${styles[position]}`;

	let d;

	if(position === 'top') {
		d = "M99.4095 71.3947C71.1213 40.8507 33.3179 11.7816 37.1727 -29.6933C41.4394 -75.599 75.854 -115.359 118.419 -133.133C158.797 -149.994 206.035 -140.256 241.822 -115.149C271.947 -94.0141 272.823 -53.8756 282.141 -18.271C292.17 20.0508 318.521 60.8106 296.501 93.7792C273.539 128.159 224.991 133.432 183.931 128.768C148.318 124.723 123.751 97.6768 99.4095 71.3947Z";
	} else {
		d = "M-38.919 2.96445C-10.8241 1.07254 20.4975 -5.87426 40.8434 11.5469C63.3629 30.8293 69.9281 62.0589 61.4141 88.8747C53.3376 114.313 28.2818 132.992 -0.0909882 140.475C-23.9759 146.775 -45.6063 132.093 -68.3914 123.11C-92.9153 113.441 -125.606 110.575 -133.794 87.7612C-142.333 63.9714 -124.677 39.0277 -104.912 21.3621C-87.7687 6.03978 -63.0936 4.59238 -38.919 2.96445Z";
	}

	return <svg
		width={width}
		height={height}
		viewBox={`0 0 ${width} ${height}`}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={blobClasses}
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d={d}
		/>
	</svg>
	;
};

export default Blob;

