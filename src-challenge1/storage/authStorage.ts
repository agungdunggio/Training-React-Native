import SecureStorage from 'react-native-fast-secure-storage';

const SESSION_KEY = '@challenge1/authSession' as const;

const SCHEMA_VERSION = 1 as const;

export type AuthUserPayload = {
  userId?: number | string;
  userName?: string;
  email?: string;
};

export type StoredUser = AuthUserPayload & {
  offlineSession?: boolean;
};

export type SaveSessionInput = {
  accessToken: string;
  user: AuthUserPayload;
  offlineSession?: boolean;
};

type AuthSessionStored = {
  schemaVersion: typeof SCHEMA_VERSION;
  accessToken: string;
  profile: AuthUserPayload;
  offlineSession: boolean;
};

function hasKeys<K extends string>(obj: unknown, keys: readonly K[]): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && keys.every((k) => k in (obj as object));
}

function parseAuthSessionStored(raw: string): AuthSessionStored | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!hasKeys(data, ['schemaVersion', 'accessToken', 'profile', 'offlineSession'])) return null;
    if (data.schemaVersion !== SCHEMA_VERSION || typeof data.accessToken !== 'string') return null;
    if (typeof data.offlineSession !== 'boolean') return null;
    if (typeof data.profile !== 'object' || data.profile === null) return null;
    return {
      schemaVersion: SCHEMA_VERSION,
      accessToken: data.accessToken,
      profile: data.profile as AuthUserPayload,
      offlineSession: data.offlineSession,
    };
  } catch {
    return null;
  }
}

async function secureGetRaw(key: string): Promise<string | null> {
  try {
    if (!(await SecureStorage.hasItem(key))) return null;
    const value = await SecureStorage.getItem(key);
    return value ?? null;
  } catch {
    return null;
  }
}

async function secureSetRaw(key: string, value: string): Promise<void> {
  await SecureStorage.setItem(key, value);
}

async function secureRemove(key: string): Promise<void> {
  try {
    await SecureStorage.removeItem(key);
  } catch {
    console.error('Failed to remove item from secure storage');
  }
}

async function persistSecureSession(session: AuthSessionStored): Promise<void> {
  await secureSetRaw(SESSION_KEY, JSON.stringify(session));
}

async function readSessionDoc(): Promise<AuthSessionStored | null> {
  const raw = await secureGetRaw(SESSION_KEY);
  if (!raw) return null;
  return parseAuthSessionStored(raw);
}

function toStoredUser(doc: AuthSessionStored): StoredUser {
  return { ...doc.profile, offlineSession: doc.offlineSession };
}

export async function saveSession(input: SaveSessionInput): Promise<void> {
  const session: AuthSessionStored = {
    schemaVersion: SCHEMA_VERSION,
    accessToken: input.accessToken,
    profile: { ...input.user },
    offlineSession: input.offlineSession ?? false,
  };
  await persistSecureSession(session);
}

export async function getAccessToken(): Promise<string | null> {
  const doc = await readSessionDoc();
  return doc?.accessToken?.length ? doc.accessToken : null;
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const doc = await readSessionDoc();
  return doc ? toStoredUser(doc) : null;
}

export async function clearSession(): Promise<void> {
  await secureRemove(SESSION_KEY);
}

export async function loadInitialSession(): Promise<{
  token: string | null;
  user: StoredUser | null;
}> {
  const doc = await readSessionDoc();
  if (!doc) return { token: null, user: null };
  return {
    token: doc.accessToken?.length ? doc.accessToken : null,
    user: toStoredUser(doc),
  };
}
