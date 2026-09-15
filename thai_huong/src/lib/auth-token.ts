const SECRET_STRING = process.env.JWT_SECRET || "thai-huong-schedule-auth-secret-key-2026";
export const SESSION_COOKIE_NAME = "thai_huong_session";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_STRING),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  email: string;
  role: "ADMIN";
  exp: number; // timestamp in ms
}

export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInDays = 7
): Promise<string> {
  const data: SessionPayload = {
    ...payload,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  };
  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(data);
  const payloadB64 = base64UrlEncode(enc.encode(payloadStr));

  const key = await getHmacKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(sigBuffer));

  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;
    if (!payloadB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const key = await getHmacKey();
    const sigBytes = base64UrlDecode(sigB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(payloadB64);
    const data: SessionPayload = JSON.parse(new TextDecoder().decode(payloadBytes));

    if (data.exp && Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
