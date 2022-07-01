import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "pg",
        connection: {
            host: 'localhost',
            port: 49153,
            database: "postgres",
            user: "postgres",
            password: "postgrespw"
        },
        pool: {
            min: 2,
            max: 10
        },
    }

};

export default config
