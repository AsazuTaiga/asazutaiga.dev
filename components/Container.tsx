import { ReactNode } from 'react'

export const Container: React.VFC<{ children: ReactNode }> = ({ children }) => (
  <div className="container">{children}</div>
)
