import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function gerarToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function verificarToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}