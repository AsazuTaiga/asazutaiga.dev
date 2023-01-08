/* eslint-disable react/no-unknown-property */

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const titel = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'blog post'

    const hasEmoji = searchParams.has('emoji')
    const emoji = hasEmoji ? searchParams.get('emoji') : '📝'

    return new ImageResponse(
      (
        <div tw="h-full w-full flex flex-col items-center justify-center bg-white">
          <div tw="text-6xl">{emoji}</div>
          <div tw="text-2xl mt-4">{titel}</div>
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
