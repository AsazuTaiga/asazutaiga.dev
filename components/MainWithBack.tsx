import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const MainWithBack: React.VFC<Props> = ({ children }) => (
  <main className="bg-yellow-50 h-screen">
    <div className="bg-yellow-50 p-10">{children}</div>
  </main>
)
