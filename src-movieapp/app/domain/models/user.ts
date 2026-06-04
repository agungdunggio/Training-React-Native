export interface User {
  id: string | number;
  username: string;
  email?: string;
  isGuest: boolean;
  token?: string;
}
