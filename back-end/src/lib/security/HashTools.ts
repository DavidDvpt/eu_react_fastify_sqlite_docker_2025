import argon2 from 'argon2';

class HashTools {
  // Keep as a static utility class (no instantiation needed)
  private constructor() {}

  static hashPassword(password: string): Promise<string> {
    // Argon2id is the recommended default
    return argon2.hash(password, { type: argon2.argon2id });
  }

  static verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}

export default HashTools;
