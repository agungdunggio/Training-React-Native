import type { Movie } from '../models/movie';

export interface MovieRepository {
  getPopularMovies(language?: string): Promise<Movie[]>;
}
