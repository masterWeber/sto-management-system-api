import { ScryptPasswordHasher } from './scrypt-password-hasher.js';

describe('ScryptPasswordHasher', () => {
  const hasher = new ScryptPasswordHasher();

  it('verifies a correct password against its hash', async () => {
    const hash = await hasher.hash('correct-horse-battery-staple');
    expect(await hasher.verify('correct-horse-battery-staple', hash)).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hasher.hash('correct-horse-battery-staple');
    expect(await hasher.verify('wrong-password', hash)).toBe(false);
  });

  it('produces a different salt for each hash of the same password', async () => {
    const hashA = await hasher.hash('same-password');
    const hashB = await hasher.hash('same-password');
    expect(hashA).not.toBe(hashB);
  });
});
