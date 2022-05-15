import { NextPage } from 'next'
import { useTheme } from '../hooks/useTheme'

const ProfilePage: NextPage = () => {
  const { theme } = useTheme()
  return (
    <div className="mt-10 flex justify-center content-center">
      <div className="max-w-lg">
        <a
          href="https://linktr.ee/asazutaiga"
          className={`
          ${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}
     hover:text-purple-500`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link Tree
        </a>
      </div>
    </div>
  )
}

export default ProfilePage
