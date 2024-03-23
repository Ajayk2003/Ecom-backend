import bcrypt from 'bcrypt'

export const passwordHasher = async (password: string) => {
  return await bcrypt.hash(password, 10)
}
