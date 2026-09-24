import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { PasswordHasher } from '../application/ports/password-hasher.port.js';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

@Injectable()
export class ScryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verify(plainPassword: string, passwordHash: string): Promise<boolean> {
    const [salt, storedKeyHex] = passwordHash.split(':');
    const storedKey = Buffer.from(storedKeyHex, 'hex');
    const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH)) as Buffer;
    return timingSafeEqual(storedKey, derivedKey);
  }
}
