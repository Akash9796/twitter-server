import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JWTUser } from "../interface";

const JWT_SECRECT = "Super1234";

class JWTService {
  public static async generateTokenForUser(user: User) {
    const payload: JWTUser = {
      id: user.id,
      email: user.email,
    };
    const token = JWT.sign(payload, JWT_SECRECT);
    return token;
  }
  public static async decodeToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRECT) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}
export default JWTService;
