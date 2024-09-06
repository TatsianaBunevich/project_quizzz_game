import { cn } from '@/lib/utils'
import { Badge } from 'ui/badge'
import { secondsToHms } from '@/helpers'
import { SettingType } from '@/types'
import { SettingsState } from 'store/types'

const SettingsBadges = ({ settings }: SettingsState) => {
  const findName = (option: SettingType[]) =>
    option.find((i) => i.isSelected)?.name

  const category = findName(settings.category)
  const difficulty = findName(settings.difficulty)
  const type = findName(settings.type)
  const amount = settings.amount
  const timer = settings.timer

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Badge variant="secondary">
        {category} {category === 'Any' && 'category'}
      </Badge>
      <Badge variant="secondary">
        {difficulty} {difficulty === 'Any' && 'difficulty'}
      </Badge>
      <Badge variant="secondary">
        {type} {type === 'Any' && 'type'}
      </Badge>
      <Badge variant="secondary">
        {amount} question{amount !== 1 && 's'}
      </Badge>
      <Badge variant="secondary" className={cn({ 'opacity-30': !timer })}>
        {timer ? secondsToHms(timer) : 'off'}
      </Badge>
    </div>
  )
}

export default SettingsBadges
