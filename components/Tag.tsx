export const Tag = ({ children }: { children: string }) => {
  return (
    <span
      className={`rounded-md p-1 bg-purple-100 dark:bg-gray-500 text-purple-700 dark:text-purple-200`}
    >
      #{children}
    </span>
  )
}
