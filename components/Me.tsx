import Image from 'next/image'
import me from '../public/me.jpg'
import twitter from '../public/twitter.svg'
import github from '../public/github.svg'
import Link from 'next/link'

export const Me: React.VFC = () => (
  <div className="flex justify-center mt-10">
    <div className="border-2 border-black rounded-3xl w-20 h-20 overflow-hidden">
      <Image src={me} />
    </div>
    <div className="flex ml-4 flex-col">
      <div className="font-bold italic text-2xl">@asazutaiga</div>
      <div className="text-xs mt-2">毎日お風呂に入るのでえらい</div>
      <div className="mt-2 flex flex-row">
        <div className="cursor-pointer">
          <Link href="https://twitter.com/asazutaiga">
            <Image src={twitter} />
          </Link>
        </div>
        <div className="ml-2 cursor-pointer">
          <Link href="https://github.com/asazutaiga">
            <Image src={github} />
          </Link>
        </div>
      </div>
    </div>
  </div>
)
