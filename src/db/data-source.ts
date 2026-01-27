import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [User],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
  logging: false,
});

export default dataSource;
