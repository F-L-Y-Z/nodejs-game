export type AuthRole = 'player' | 'admin' | 'guest';

export type AuthContext = {
  userId: string;
  displayName: string;
  roles: AuthRole[];
  gameId?: string;
};

export type TokenVerifier = (token: string | undefined) => Promise<AuthContext>;
