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
        className={`ml-4 font-semibold
        text-2xl
        text-gray-900
        dark:text-white`}
      >
        asazutaiga.dev
      </Link>
      <ThemeSwitch />
    </header>
  )
}
