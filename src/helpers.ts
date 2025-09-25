export const secondsToHms = (d: number): string => {
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)
  const displayedHms = (data: number) => String(data).padStart(2, '0')
  return `${h > 0 ? displayedHms(h) + ' : ' : ''}${displayedHms(m)} : ${displayedHms(s)}`
}
