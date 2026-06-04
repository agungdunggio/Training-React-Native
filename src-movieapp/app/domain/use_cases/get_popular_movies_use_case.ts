import type { MovieRepository } from '../repositories/movie_repository';
import type { Movie } from '../models/movie';

export class GetPopularMoviesUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute(language: string = 'id-ID'): Promise<Movie[]> {
    return await this.movieRepository.getPopularMovies(language);
  }
}
