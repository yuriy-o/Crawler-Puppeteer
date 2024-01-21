import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class ScraperEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  url: string;

  @Column({ default: '' })
  bookText: string;

  @Column({ default: 0 })
  characterCount: number;

  @Column({ default: 0 })
  paginationCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
