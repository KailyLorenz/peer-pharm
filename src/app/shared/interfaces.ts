export interface Movie {
  imdbID: string
  title: string
  year: string
  type: string
  poster: string
}

export interface AngularResponseDB {
  results: Movie[]
  totalResults: string
}

export interface AccMovie {
  type: string
  count: number
}
