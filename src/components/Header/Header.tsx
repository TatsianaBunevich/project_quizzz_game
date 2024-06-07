import React from 'react';
import Blob from '../Blob/Blob';
import Toggle from '../Toggle/Toggle';
import { ThemeProps } from '../../types';

const Header: React.FC<ThemeProps> = ({ theme, onSwitchTheme }) => {
	return (
		<header>
			<Blob theme={theme} position={'top'} width={162} height={187} />
			<Blob theme={theme} position={'bottom'} width={65} height={62} />
			<Toggle theme={theme} onSwitchTheme={onSwitchTheme} />
		</header>
	);
};

export default Header;

