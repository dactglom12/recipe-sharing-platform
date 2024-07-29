import { Injectable } from '@nestjs/common';
import { CreateChefDto } from './dto/create-chef.dto';
import { UpdateChefDto } from './dto/update-chef.dto';
import { Chef } from './entities/chef.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class ChefsService {
  constructor(
    @InjectRepository(Chef) private readonly chefRepository: Repository<Chef>,
  ) {}

  async create(createChefDto: CreateChefDto) {
    const formattedEmail = createChefDto.email.toLowerCase();

    const chef = new Chef();

    chef.username = createChefDto.username;
    chef.email = formattedEmail;
    chef.is_email_confirmed = false;
    chef.password = await hash(createChefDto.password, SALT_ROUNDS);

    chef.first_name = createChefDto.first_name;
    chef.last_name = createChefDto.last_name;

    chef.recipes = [];

    return this.chefRepository.save(chef);
  }

  findAll() {
    return this.chefRepository.find();
  }

  findOne(id: string) {
    return this.chefRepository.findOne({ where: { id } });
  }

  findOneBy(criteria: Partial<Chef>) {
    return this.chefRepository.findOneBy(criteria);
  }

  findManyBy(criteria: Partial<Chef>) {
    return this.chefRepository.findBy(criteria);
  }

  update(id: string, updateChefDto: UpdateChefDto) {
    return this.chefRepository.update({ id }, updateChefDto);
  }

  remove(id: string) {
    return this.chefRepository.delete(id);
  }
}
