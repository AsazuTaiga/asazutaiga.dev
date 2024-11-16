import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-3">
      <h1 className="text-2xl font-extrabold">404 Not Found</h1>
      <p className="text-md">お探しのページは見つかりませんでした。</p>
      <Link href="/" passHref className="underline text-purple-400">
        トップページへ戻る
      </Link>
    </div>
  )
}

export default NotFoundPage
