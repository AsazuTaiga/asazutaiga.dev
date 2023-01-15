import { useTheme } from '../hooks/useTheme'

export const Tag = ({ children }: { children: string }) => {
  const { theme } = useTheme()
  return (
    <span
      className={`rounded-md p-1 ${
        theme === 'light'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-gray-500 text-purple-200'
      }`}
    >
      #{children}
    </span>
  )
}
