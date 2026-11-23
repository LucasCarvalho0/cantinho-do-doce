import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "cantinho-doce-jwt-secret-2027-security-key";

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
  exp: number;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computedHash, "hex"));
  } catch {
    return false;
  }
}

export function createToken(userId: number, username: string, role = "admin"): string {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const payload: TokenPayload = { userId, username, role, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadBase64)
    .digest("base64url");
  return `${payloadBase64}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [payloadBase64, signature] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload: TokenPayload = JSON.parse(payloadJson);

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
