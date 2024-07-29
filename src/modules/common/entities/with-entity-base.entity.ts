import { randomBytes } from 'crypto';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class WithEntityBase {
  @PrimaryColumn({
    type: 'char',
    length: 32,
  })
  id: string = randomBytes(16).toString('hex');

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
