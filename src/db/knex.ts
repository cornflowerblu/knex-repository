import Knex from 'knex';
import knexConfig from './config';

require('dotenv').config();
const knex = async () => Knex(knexConfig[process.env.NODE_ENV || 'development']);

export default knex;