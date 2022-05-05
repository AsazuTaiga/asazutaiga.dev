import { NextPage } from 'next'

const ProfilePage: NextPage = () => (
  <div className="mt-10 flex justify-center content-center">
    <div className="max-w-lg">
      <h1 className="text-2xl">Profile</h1>
      <p className="font-bold text-xs mt-10">
        私たちは「私は誰なのだろうか？」という問いに、「テーブルとは何ですか？」という問に対するのと同じように答えようとしてしまう。
      </p>
      <p className="text-xs mt-2">
        ――ノーレン・ガーツ『ニヒリズムとテクノロジー』
      </p>
      <div className="mt-10 grid grid-cols-3 gap-10 p-2">
        <div className="opacity-60 col-span-1">名前</div>
        <div className="col-span-2">Asazu Taiga</div>
        <div className="opacity-60 col-span-1">職業</div>
        <div className="col-span-2">Frontend Engineer</div>
        <div className="opacity-60 col-span-1">関心分野</div>
        <div className="col-span-2">
          Frontend Architecture, Component Design
        </div>
        <div className="opacity-60 col-span-1">好きなライブラリ</div>
        <div className="col-span-2">React, Apollo Client, Storybook</div>
        <div className="opacity-60 col-span-1">その他できること</div>
        <div className="col-span-2">Figma, Scrum Master</div>
        <div className="opacity-60 col-span-1">趣味</div>
        <div className="col-span-2">俳句</div>
      </div>
    </div>
  </div>
)

export default ProfilePage
