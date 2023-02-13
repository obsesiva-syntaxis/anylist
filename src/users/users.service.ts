import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async create( signupInput: SignupInput ) {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.usersRepository.save( newUser );
    } catch (err) { this.handleDBErrors(err) }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (err) {
      throw new BadRequestException(`${ email } Not found!`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (err) {
      throw new BadRequestException(`${ id } Not found!`);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`block method not implemented`);
  }

  private handleDBErrors( err: any ): never {
    if( err.code === '23505' ) throw new BadRequestException( err.detail.replace('Key ', '') );
    this.logger.error( err );
    throw new InternalServerErrorException(`Ups, Algo salió mal :(`);
  }
}
