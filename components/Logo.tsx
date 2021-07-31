import logo from '../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

export const Logo: React.VFC = () => (
  <div className="flex justify-center cursor-pointer">
    <Link href="/">
      <Image src={logo} alt="お前もインターネットにしてやろうか！" />
    </Link>
  </div>
)
