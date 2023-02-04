import { Tab } from '@headlessui/react'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

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
  return (
    <Tab.Group selectedIndex={StateToIndex[selected]} onChange={handleChange}>
      <Tab.List
        className={`flex p-1 rounded-md justify-between gap-2
        bg-purple-100 dark:bg-gray-800
        text-gray-900 dark:text-white
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
  return (
    <Tab
      className={`text-xl rounded-md p-1 flex-1 bg-transparent focus:ring-4 outline-none ${
        selected ? 'font-bold bg-white dark:bg-purple-400' : ''
      }
    `}
    >
      {children}
    </Tab>
  )
}

export const useTab = () => {
  const router = useRouter()
  const selected =
    typeof router.query.selected === 'string'
      ? (router.query.selected as TabState)
      : 'all'

  const onClick = useCallback(
    (state: TabState) => {
      router.replace({
        query: {
          selected: state,
        },
      })
    },
    [router],
  )

  const tab = useMemo(
    () => <MyTabs selected={selected} onChange={onClick} />,
    [selected, onClick],
  )

  return { selected, onClick, tab }
}
