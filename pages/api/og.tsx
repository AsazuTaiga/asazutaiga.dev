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
        <div tw="flex h-full w-full flex-col items-center justify-center border-8 border-purple-400 bg-white p-10">
          <div tw="flex h-64 w-64 items-center justify-center rounded-full bg-purple-100 p-7 text-9xl">
            {emoji}
          </div>
          <div tw="mt-8 text-4xl">{title}</div>
          <div tw="mt-4 text-2xl font-extrabold text-purple-500">
            asazutaiga.dev
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
