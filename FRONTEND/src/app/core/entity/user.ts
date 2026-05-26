export interface Role{
    id: number;
    name: string;
}

export interface User{
    id?: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roles?: Role[];
  }