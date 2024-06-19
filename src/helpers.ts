export const secondsToHms = (d: number) : string => {
	const h = Math.floor(d / 3600);
	const m = Math.floor((d % 3600) / 60);
	const s = Math.floor((d % 3600) % 60);
	const hours = String(h).padStart(2, "0");
	const minutes = String(m).padStart(2, "0");
	const seconds = String(s).padStart(2, "0");
	return `${h > 0 ? hours + ' : ' : ''}${minutes} : ${seconds}`;
};