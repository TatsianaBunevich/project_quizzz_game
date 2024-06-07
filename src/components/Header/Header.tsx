import Toggle from '../Toggle/Toggle';
import { Theme } from '../../types';

type HeaderProps = {
	theme: Theme;
	onSwitchTheme: (theme: Theme) => void;
};

const Header = ({ theme, onSwitchTheme }: HeaderProps) => {
	return (
		<header>
			<Toggle theme={theme} onSwitchTheme={onSwitchTheme} />
		</header>
	);
};

export default Header;


