import { Switch } from '@headlessui/react'
import { useTheme } from '../hooks/useTheme'

export const ThemeSwitch: React.VFC = () => {
  const { theme, setTheme } = useTheme()
  const checked = theme === 'dark'
  return (
    <Switch
      as="button"
      name="ダークモード切り替え"
      checked={checked}
      onChange={(checked) => {
        if (checked) {
          setTheme?.('dark')
        } else {
          setTheme?.('light')
        }
      }}
      className={`${
        checked ? 'bg-yellow-300' : 'bg-gray-600'
      } h-6 rounded-full w-11 fixed top-3 right-3 transition-color duration-200`}
    >
      {({ checked }) => (
        <span
          className={`${
            checked ? 'translate-x-5' : 'translate-x-1'
          } block w-5 h-5 duration-200 ease-in-out transform bg-white rounded-full`}
        />
      )}
    </Switch>
  )
}
