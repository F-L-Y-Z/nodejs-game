export type SessionAuthContext = {
  userId: string;
};

export type SessionClaimResult = {
  previousSessionId?: string;
};

export type SessionReleaseResult<TAuth extends SessionAuthContext> = {
  auth?: TAuth;
  wasActive: boolean;
};

export class RoomSessionRegistry<TAuth extends SessionAuthContext> {
  private readonly authBySessionId = new Map<string, TAuth>();
  private readonly activeSessionIdByUserId = new Map<string, string>();

  claim(sessionId: string, auth: TAuth): SessionClaimResult {
    const previousSessionId = this.activeSessionIdByUserId.get(auth.userId);

    this.authBySessionId.set(sessionId, auth);
    this.activeSessionIdByUserId.set(auth.userId, sessionId);

    return previousSessionId && previousSessionId !== sessionId ? { previousSessionId } : {};
  }

  getAuth(sessionId: string): TAuth | undefined {
    return this.authBySessionId.get(sessionId);
  }

  getActiveSessionId(userId: string): string | undefined {
    return this.activeSessionIdByUserId.get(userId);
  }

  isActive(sessionId: string): boolean {
    const auth = this.authBySessionId.get(sessionId);
    return Boolean(auth && this.activeSessionIdByUserId.get(auth.userId) === sessionId);
  }

  release(sessionId: string): SessionReleaseResult<TAuth> {
    const auth = this.authBySessionId.get(sessionId);
    this.authBySessionId.delete(sessionId);

    if (!auth) return { wasActive: false };

    const wasActive = this.activeSessionIdByUserId.get(auth.userId) === sessionId;
    if (wasActive) this.activeSessionIdByUserId.delete(auth.userId);

    return { auth, wasActive };
  }

  removeUser(userId: string): void {
    const sessionId = this.activeSessionIdByUserId.get(userId);
    if (sessionId) this.authBySessionId.delete(sessionId);
    this.activeSessionIdByUserId.delete(userId);
  }

  clear(): void {
    this.authBySessionId.clear();
    this.activeSessionIdByUserId.clear();
  }
}
