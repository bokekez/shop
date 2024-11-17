export interface User {
  id: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthContextType {
  user: User;
  checkToken: boolean;
  setUser: (user: User) => void; 
}

export interface UserResponse extends User{
  accessToken: string;
}