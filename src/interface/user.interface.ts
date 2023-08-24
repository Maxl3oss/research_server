import { JwtPayload } from "jsonwebtoken"

export interface UserEmail {
  email: string
  password: string
}

export interface TokenPayloadVerify extends JwtPayload {
  email: string;
}