import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
  SuperAdmin = "superadmin",
  Admin = "admin",
  User = "user",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role!: UserRole;

  @Column({ type: "boolean" })
  isOnboarded!: boolean;

  @Column({ type: "timestamptz" })
  createdAt!: Date;

  @Column({ type: "timestamptz", nullable: true })
  deletedAt!: Date;

  @Column({ type: "timestamptz", nullable: true })
  updatedAt!: Date;
}
