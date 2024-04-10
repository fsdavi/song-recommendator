export type Song = {
  title: string
  artists: string[]
  genres: string[]
  listenMetrics: number
  link: string
}

export type Genre = {
  value: string
  label: string
}