export type Song = {
  title: string
  artists: string[]
  genres: string[]
  listenMetrics: number
  points: number | undefined
}

export type Genre = {
  value: string
  label: string
}