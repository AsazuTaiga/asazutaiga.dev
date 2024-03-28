import Link from 'next/link'
import { ThemeSwitch } from './ThemeSwitch'

export const AppBar = () => {
  return (
    <header
      className={`flex justify-between items-center h-16 fixed w-full z-10 
      backdrop-blur-xl shadow-md
      bg-white dark:bg-gray-900
      `}
    >
      <Link
        passHref
        href="/"
        className={`ml-4 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 focus:ring-4 outline-none`}
      >
        asazutaiga.dev
      </Link>
      <ThemeSwitch />
    </header>
  )
}
