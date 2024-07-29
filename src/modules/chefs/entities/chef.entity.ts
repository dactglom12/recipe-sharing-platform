import { WithEntityBase } from 'src/modules/common/entities/with-entity-base.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Chef extends WithEntityBase {
  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'boolean' })
  is_email_confirmed: boolean;

  @OneToMany(() => Recipe, (recipe) => recipe.chef)
  recipes: Recipe[];
}
