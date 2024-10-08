import useGetData from 'hooks/use-get-data'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { Tags, Gauge, SwatchBook, Sigma, Timer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from 'ui/card'
import { ScrollArea, ScrollBar } from 'ui/scroll-area'
import { Slider } from 'ui/slider'
import { Switch } from 'ui/switch'
import { Button } from 'ui/button'
import { useState, useMemo, useCallback } from 'react'
import { secondsToHms } from '@/helpers'
import { debounce } from 'lodash'
import { CategoriesResponse, SettingsType } from '@/types'
import { SettingsState, SettingsActions } from 'store/types'

const SettingsTabs = ({
  settings,
  updateSettings,
  handleSelectOption,
}: SettingsState & SettingsActions) => {
  const [rangeValue, setRangeValue] = useState([settings.amount])
  const [timerValue, setTimerValue] = useState([
    settings.timer === 0 ? 10 : settings.timer,
  ])
  const [isTimer, setIsTimer] = useState(settings.timer === 0 ? false : true)

  useGetData<CategoriesResponse>(
    'settings',
    'https://opentdb.com/api_category.php',
    settings.category.length === 1 ? updateSettings : undefined
  )

  const debounceFn = useMemo(
    () => debounce(handleSelectOption, 300),
    [handleSelectOption]
  )

  const handleSliderChange = useCallback(
    (value: number[], type: keyof SettingsType) => {
      if (type === 'amount') {
        setRangeValue(value)
      } else {
        setTimerValue(value)
      }
      debounceFn(value[0], type)
    },
    [debounceFn]
  )

  const handleCheckboxChange = useCallback(() => {
    setIsTimer(!isTimer)
    isTimer && setTimerValue(timerValue)
    handleSelectOption(isTimer ? 0 : timerValue[0], 'timer')
  }, [handleSelectOption, isTimer, timerValue])

  const memoizedCategory = useMemo(
    () =>
      settings.category.map((option) => (
        <Button
          key={option.id}
          variant={option.isSelected ? 'default' : 'outline'}
          className="whitespace-break-spaces"
          onClick={() => handleSelectOption(option.id, 'category')}
        >
          {option.name}
        </Button>
      )),
    [handleSelectOption, settings.category]
  )

  const memoizedDifficulty = useMemo(
    () =>
      settings.difficulty.map((option) => (
        <Button
          key={option.id}
          variant={option.isSelected ? 'default' : 'outline'}
          onClick={() => handleSelectOption(option.id, 'difficulty')}
        >
          {option.name}
        </Button>
      )),
    [handleSelectOption, settings.difficulty]
  )

  const memoizedType = useMemo(
    () =>
      settings.type.map((option) => (
        <Button
          key={option.id}
          variant={option.isSelected ? 'default' : 'outline'}
          onClick={() => handleSelectOption(option.id, 'type')}
        >
          {option.name}
        </Button>
      )),
    [handleSelectOption, settings.type]
  )

  const memoizedAmount = useMemo(
    () => (
      <Slider
        id="amount"
        defaultValue={rangeValue}
        min={1}
        max={50}
        step={1}
        value={rangeValue}
        onValueChange={(i) => handleSliderChange(i, 'amount')}
      />
    ),
    [handleSliderChange, rangeValue]
  )

  const memoizedTimer = useMemo(
    () => (
      <>
        <Switch
          checked={isTimer}
          onCheckedChange={handleCheckboxChange}
          className="absolute right-6 top-6"
        />
        <Slider
          id="timer"
          defaultValue={timerValue}
          min={10}
          max={120}
          step={10}
          value={timerValue}
          disabled={!isTimer}
          className={cn({ 'opacity-30': !isTimer })}
          onValueChange={(i) => handleSliderChange(i, 'timer')}
        />
      </>
    ),
    [handleCheckboxChange, handleSliderChange, isTimer, timerValue]
  )

  return (
    <Tabs defaultValue="category">
      <TabsList className="w-full items-stretch [&>*>span]:ml-2 max-sm:[&>*>span]:hidden [&>*]:w-full [&>*]:rounded-full">
        <TabsTrigger value="category">
          <Tags />
          <span>Category</span>
        </TabsTrigger>
        <TabsTrigger value="difficulty">
          <Gauge />
          <span>Difficulty</span>
        </TabsTrigger>
        <TabsTrigger value="type">
          <SwatchBook />
          <span>Type</span>
        </TabsTrigger>
        <TabsTrigger value="amount">
          <Sigma />
          <span>Amount</span>
        </TabsTrigger>
        <TabsTrigger value="timer">
          <Timer />
          <span>Timer</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="category">
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="max-sm:h-[calc(100vh-72px-40px-0.5rem-51px-1rem-72px-1.5rem*2-1px*2)]">
              <div className="flex flex-wrap gap-2 md:gap-4 [&>*]:flex-auto max-sm:[&>*]:w-full max-sm:[&>*]:leading-4">
                {memoizedCategory}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="difficulty">
        <Card>
          <CardContent className="flex flex-wrap gap-4 pt-6 [&>*]:flex-auto max-sm:[&>*]:w-full">
            {memoizedDifficulty}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="type">
        <Card>
          <CardContent className="flex flex-wrap gap-4 pt-6 [&>*]:flex-auto max-sm:[&>*]:w-full">
            {memoizedType}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="amount">
        <Card>
          <CardHeader>
            <CardDescription>
              Number of Questions: <b>{rangeValue}</b>
            </CardDescription>
          </CardHeader>
          <CardContent>{memoizedAmount}</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="timer">
        <Card className="relative">
          <CardHeader>
            <CardDescription>
              Timer (per question):{' '}
              <b>
                {isTimer && settings.timer
                  ? secondsToHms(settings.timer)
                  : 'off'}
              </b>
            </CardDescription>
          </CardHeader>
          <CardContent>{memoizedTimer}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default SettingsTabs
