import logo from '../public/logo.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const Logo: React.VFC = () => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push('/')}
      className="flex justify-center cursor-pointer"
    >
      <Image src={logo} alt="お前もインターネットにしてやろうか！" />
    </div>
  )
}
