import type { UserRepository } from '../../lib/repositories/index.js';

class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  getByEmail(email: string) {
    return this.usersRepository.findUnique({ where: { email } });
  }

  getByPseudo(pseudo: string) {
    return this.usersRepository.findUnique({ where: { pseudo } });
  }

  getById(id: string) {
    return this.usersRepository.findUnique({ where: { id } });
  }

  createAuthUser(data: {
    email: string;
    pseudo: string;
    passwordHash: string;
    firstname?: string;
    lastname?: string;
  }) {
    return this.usersRepository.create({
      data: {
        email: data.email,
        pseudo: data.pseudo,
        firstname: data.firstname,
        lastname: data.lastname,
        password_hash: data.passwordHash,
        role: 'USER',
        is_active: true,
        date_created: new Date().toISOString(),
      },
      select: { id: true, email: true, role: true },
    });
  }
}

export { UsersService };

