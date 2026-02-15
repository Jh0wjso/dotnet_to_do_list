interface Auth {
  token: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  email: string;
  isEmailConfirmed: boolean;
}

export type { Auth, User };
