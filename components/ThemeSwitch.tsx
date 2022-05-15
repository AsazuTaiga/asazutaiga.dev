import { Switch } from '@headlessui/react'
import { useTheme } from '../hooks/useTheme'
import { sendSwitchThemeEvent } from '../utils/gtag'
import { FiSun, FiMoon } from 'react-icons/fi'

export const ThemeSwitch: React.VFC = () => {
  const { theme, setTheme } = useTheme()
  const checked = theme === 'dark'
  return (
    <Switch
      as="button"
      aria-label="ダークモード切り替え"
      aria-checked={checked}
      checked={checked}
      onChange={(checked) => {
        if (checked) {
          setTheme?.('dark')
          sendSwitchThemeEvent('dark')
        } else {
          setTheme?.('light')
          sendSwitchThemeEvent('light')
        }
      }}
      className={`${
        checked ? 'bg-purple-300' : 'bg-gray-600'
      } h-6 rounded-full w-11 fixed top-5 right-5 transition-color duration-200 z-10 shadow-md`}
    >
      {({ checked }) => (
        <div
          className={`${
            checked
              ? 'translate-x-6 text-gray-600'
              : 'translate-x-1 text-purple-300'
          } block w-5 h-5 mt-1 duration-200 ease-in-out transform rounded-full`}
        >
          {checked ? <FiMoon /> : <FiSun />}
        </div>
      )}
    </Switch>
  )
}
