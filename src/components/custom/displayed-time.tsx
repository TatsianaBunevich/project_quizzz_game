import { cn } from '@/lib/utils'

interface DisplayedTimeProps extends React.ComponentProps<'div'> {
  seconds: number
}
const DisplayedTime = ({ seconds, className }: DisplayedTimeProps) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor((seconds % 3600) % 60)

  const timeParts = [
    { value: h, label: 'hr' },
    { value: m, label: 'min' },
    { value: s, label: 'sec' },
  ]

  return (
    <div
      className={cn(
        'flex items-baseline gap-1 tabular-nums leading-none',
        className
      )}
    >
      {timeParts.map(({ value, label }) =>
        value > 0 ? (
          <div key={label} className="space-x-2">
            {value}{' '}
            <span className="font-normal text-muted-foreground">{label}</span>
          </div>
        ) : label === 'sec' ? (
          <>
            &lt; 1{' '}
            <span className="font-normal text-muted-foreground">{label}</span>
          </>
        ) : null
      )}
    </div>
  )
}

export default DisplayedTime
