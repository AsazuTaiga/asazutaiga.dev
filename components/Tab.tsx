import { Tab } from '@headlessui/react'
import { useCallback, useMemo, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

type TabState = 'all' | 'tech' | 'life'
const StateToIndex: Record<TabState, number> = {
  all: 0,
  tech: 1,
  life: 2,
}
const IndexToState: Record<number, TabState> = {
  0: 'all',
  1: 'tech',
  2: 'life',
}

type Props = {
  selected: TabState
  onChange: (state: TabState) => void
}

const MyTabs = ({ selected, onChange }: Props) => {
  const handleChange = useCallback(
    (i: number) => {
      onChange(IndexToState[i])
    },
    [onChange],
  )
  const { theme } = useTheme()
  return (
    <Tab.Group selectedIndex={StateToIndex[selected]} onChange={handleChange}>
      <Tab.List
        className={`flex p-1 rounded-md justify-between gap-2
          ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-800'}
        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
        `}
      >
        <MyTab selected={selected === 'all'}>All</MyTab>
        <MyTab selected={selected === 'tech'}>Tech</MyTab>
        <MyTab selected={selected === 'life'}>Life</MyTab>
      </Tab.List>
    </Tab.Group>
  )
}

const MyTab = ({
  selected,
  children,
}: {
  selected: boolean
  children: string
}) => {
  const { theme } = useTheme()
  return (
    <Tab
      className={`text-xl rounded-md p-1 flex-1 bg-transparent focus:ring-4 outline-none ${
        selected ? 'font-bold' : ''
      }
      ${selected && theme === 'light' ? 'bg-white' : ''}
      ${selected && theme === 'dark' ? 'bg-indigo-900' : ''}
    `}
    >
      {children}
    </Tab>
  )
}

export const useTab = () => {
  const [selected, setSelected] = useState<TabState>('all')

  const onClick = useCallback((state: TabState) => {
    setSelected(state)
  }, [])

  const tab = useMemo(
    () => <MyTabs selected={selected} onChange={onClick} />,
    [selected, onClick],
  )

  return { selected, onClick, tab }
}