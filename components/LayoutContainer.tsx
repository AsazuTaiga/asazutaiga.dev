import { ReactNode } from 'react'

export const LayoutContainer: React.VFC<{ children: ReactNode }> = ({
  children,
}) => <div className="container mx-auto max-w-4xl px-4 py-10">{children}</div>
