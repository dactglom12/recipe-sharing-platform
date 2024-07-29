import { Chef } from 'src/modules/chefs/entities/chef.entity';
import { WithEntityBase } from 'src/modules/common/entities/with-entity-base.entity';
import { RecipeTag } from 'src/modules/recipe-tag/entities/recipe-tag.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Recipe extends WithEntityBase {
  @Column({ type: 'text' })
  content: string;

  @OneToMany(() => RecipeTag, (tag) => tag.recipe)
  tags: RecipeTag[];

  @ManyToOne(() => Chef, (chef) => chef.recipes)
  chef: Chef;
}
