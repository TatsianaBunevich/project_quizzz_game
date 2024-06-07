import Blob from '../Blob/Blob';
import Toggle from '../Toggle/Toggle';
import { Theme } from '../../types';

type HeaderProps = {
	play: boolean;
	theme: Theme;
	onSwitchTheme: (theme: Theme) => void;
};

const Header = ({ play, theme, onSwitchTheme }: HeaderProps) => {
	return (
		<header>
			<Blob theme={theme} play={play} position='top' width={play ? 162 : 194} height={play ? 187 : 197} />
			<Blob theme={theme} play={play} position='bottom' width={play ? 65 : 148} height={play ? 62 : 118} />
			<Toggle theme={theme} onSwitchTheme={onSwitchTheme} />
		</header>
	);
};

export default Header;


