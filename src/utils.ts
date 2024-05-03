export const formatDate = (date: string) => {
  const { format } = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'short'
  })
  return format(new Date(date))
}
