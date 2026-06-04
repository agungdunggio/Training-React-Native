import type { Movie } from '../../domain/models/movie';


export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  Home: undefined;
  MovieDetail: { movie: Movie };
  Account: undefined;
};
