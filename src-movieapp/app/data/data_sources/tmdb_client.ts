import axios from 'axios';
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@env';

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

