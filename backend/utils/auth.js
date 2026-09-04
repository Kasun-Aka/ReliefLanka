const crypto = require("crypto");

const TOKEN_TTL_SECONDS = 60 * 60 * 24;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return resolve(false);
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      const expected = Buffer.from(key, "hex");
      resolve(expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey));
    });
  });
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function signToken(payload) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }));
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) throw new Error("Malformed token");
  const expected = crypto.createHmac("sha256", process.env.JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid token");
  }
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Expired token");
  return payload;
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
