import { WithEntityBase } from 'src/modules/common/entities/with-entity-base.entity';
import { Recipe } from 'src/modules/recipes/entities/recipe.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RecipeTag extends WithEntityBase {
  @Column({ type: 'text' })
  label: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.tags)
  recipe: Recipe;
}
