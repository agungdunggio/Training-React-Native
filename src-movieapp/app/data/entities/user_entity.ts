export interface UserEntity {
  id: string | number;
  username: string;
  email?: string;
  token?: string;
  role: 'user' | 'guest';
}
