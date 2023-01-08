/* eslint-disable react/no-unknown-property */ // tw propが怒られるので無効化

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'blog post'

    const hasEmoji = searchParams.has('emoji')
    const emoji = hasEmoji ? searchParams.get('emoji') : '📝'

    return new ImageResponse(
      (
        <div tw="h-full w-full flex flex-col items-center justify-center bg-white">
          <div tw="p-7 rounded-full bg-purple-100 flex justify-center items-center">
            <div tw="text-6xl">{emoji}</div>
          </div>
          <div tw="text-2xl mt-4">{title}</div>
          <div tw="text-sm mt-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            asazutaiga.com
          </div>
        </div>
      ),
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message)
    }
    return new Response('Failed to generate the image', { status: 500 })
  }
}
