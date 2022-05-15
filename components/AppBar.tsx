import Link from 'next/link'
import { useTheme } from '../hooks/useTheme'
import { ThemeSwitch } from './ThemeSwitch'

export const AppBar = () => {
  const { theme } = useTheme()

  return (
    <header
      className={`flex justify-between items-center h-16 fixed w-full z-10 
      backdrop-blur-xl shadow-md
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      `}
    >
      <Link passHref href="/">
        <a
          className={`ml-4 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600
        `}
        >
          asazutaiga.dev
        </a>
      </Link>
      <ThemeSwitch />
    </header>
  )
}
