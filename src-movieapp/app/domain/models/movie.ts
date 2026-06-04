export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  year: string;
  icon: string;
  description: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
}
