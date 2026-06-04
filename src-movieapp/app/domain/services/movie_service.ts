import { MovieRepositoryImpl } from '../../data/repositories/movie_repository_impl';
import type { MovieRepository } from '../repositories/movie_repository';
import { GetPopularMoviesUseCase } from '../use_cases/get_popular_movies_use_case';

export class MovieService {
  private static instance: MovieService | null = null;

  private repository: MovieRepository;
  
  public getPopularMoviesUseCase: GetPopularMoviesUseCase;

  private constructor() {
    this.repository = new MovieRepositoryImpl();
    this.getPopularMoviesUseCase = new GetPopularMoviesUseCase(this.repository);
  }

  public static getInstance(): MovieService {
    if (!MovieService.instance) {
      MovieService.instance = new MovieService();
    }
    return MovieService.instance;
  }
}
