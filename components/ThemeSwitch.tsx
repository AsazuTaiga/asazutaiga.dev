import { Switch } from '@headlessui/react'
import { useTheme } from '../hooks/useTheme'
import { sendSwitchThemeEvent } from '../utils/gtag'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useCallback } from 'react'

export const ThemeSwitch: React.VFC = () => {
  const { theme, setTheme } = useTheme()
  const handleChange = useCallback(
    (checked: boolean) => {
      setTheme?.(checked ? 'dark' : 'light')
      sendSwitchThemeEvent(checked ? 'dark' : 'light')
    },
    [setTheme],
  )

  return (
    <Switch
      as="button"
      aria-label="ダークモード切り替え"
      aria-checked={theme === 'dark'}
      checked={theme === 'dark'}
      onChange={handleChange}
      className={`bg-purple-300 dark:bg-gray-600 h-6 rounded-full w-11 fixed top-5 right-5 transition-color duration-200 z-10 shadow-md focus:ring-4 outline-none  `}
    >
      {({ checked }) => (
        <div
          className={`translate-x-6 text-gray-600 dark:translate-x-1 dark:text-purple-300 block w-5 h-5 mt-1 duration-200 ease-in-out transform rounded-full`}
        >
          {checked ? <FiMoon /> : <FiSun />}
        </div>
      )}
    </Switch>
  )
}
