import type { MovieRepository } from '../../domain/repositories/movie_repository';
import type { Movie } from '../../domain/models/movie';
import type { MovieEntity, PopularMoviesResponse } from '../entities/movie_entity';
import { tmdbClient } from '../data_sources/tmdb_client';

export class MovieRepositoryImpl implements MovieRepository {
  async getPopularMovies(language: string = 'id-ID'): Promise<Movie[]> {
    try {
      const response = await tmdbClient.get<PopularMoviesResponse>('/movie/popular', {
        params: { language },
      });
      
      const results = response.data?.results || [];
      return results.map(entity => this.mapToDomain(entity));
    } catch (error) {
      console.error('Error fetching popular movies from TMDB:', error);
      throw error;
    }
  }

  private mapToDomain(entity: MovieEntity): Movie {
    const releaseYear = entity.release_date ? entity.release_date.split('-')[0] : 'N/A';
    
    return {
      id: String(entity.id),
      title: entity.title,
      genre: this.getGenreLabel(entity.genre_ids),
      rating: entity.vote_average ? Number((entity.vote_average / 2).toFixed(1)) : 4.5,
      year: releaseYear,
      icon: '🎬',
      description: entity.overview || 'Sinopsis tidak tersedia untuk film ini.',
      poster_path: entity.poster_path || undefined,
      backdrop_path: entity.backdrop_path || undefined,
      release_date: entity.release_date,
    };
  }

  private getGenreLabel(genreIds: number[]): string {
    if (!genreIds || genreIds.length === 0) return 'Drama / Action';
    
    const genreMap: Record<number, string> = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };

    return genreIds
      .map(id => genreMap[id])
      .filter(Boolean)
      .slice(0, 3)
      .join(' / ') || 'Drama / Action';
  }
}
