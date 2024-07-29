import { WithEntityBase } from 'src/modules/common/entities/with-entity-base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken extends WithEntityBase {
  @Column({ type: 'text' })
  token_body: string;

  @Column({ type: 'varchar', length: 32 })
  user_id: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
