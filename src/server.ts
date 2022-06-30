import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom';
import { Knex } from 'knex';
import knex from './db/db'
import v4, { uuid } from 'uuidv4';

const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: 'localhost'
    });

    const db: Knex = await knex();

    server.route({
        method: 'GET',
        path: '/user/account',
        handler: async (request, h) => {
            try {
                const data = await
                    db('users')
                        .join('accounts', 'users.id', '=', 'accounts.user_id')
                        .select('users.id', 'users.user_name', 'accounts.account_name')
                return h.response({
                    success: true,
                    response: {
                        message: 'Query executed successfully.',
                        data: data
                    }
                })
            } catch (err) {
                console.log(err)
                const error = Boom.badRequest('Query could not be run.')
                return h.response({
                    success: false,
                    response: error.output.payload,
                }).code(error.output.statusCode)
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            try {
                const data = await db('users').select().limit(request.query.limit || 100)
                const count = await db('users').count()
                return h.response({
                    success: true,
                    response: {
                        message: 'Query executed successfully.',
                        data: data, count
                    }
                })
            } catch (err) {
                console.log(err)
                const error = Boom.badRequest('Query could not be run.')
                return h.response({
                    success: false,
                    response: error.output.payload,
                }).code(error.output.statusCode)
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/account/create',
        handler: async (request, h) => {
            const body: {
                user_name: string,
                account_name: string
            } = request.payload as any

            try {
                // Generate IDs
                const userId = uuid()
                const accountId = uuid()

                // Insert a user first and then associate an account. TODO: if account creation fails, delete user.
                await db.raw(`
                    INSERT INTO public.users (id, user_name) 
                    VALUES('${userId}', '${body.user_name}');
                    `)
                await db.raw(`
                    INSERT INTO public.accounts (id, account_name, user_id) 
                    VALUES('${accountId}', '${body.account_name}', '${userId}')
                `)

                // Fetch the newly created user account and return it in the response
                const userAccount =
                    await db('users')
                        .join('accounts', 'users.id', '=', 'accounts.user_id')
                        .select('users.id', 'users.user_name', 'accounts.account_name')
                        .where('users.id', '=', `${userId}`)

                return h.response({
                    success: true,
                    response: {
                        message: 'New user added successfully.',
                        data: userAccount
                    }
                })
            } catch (err) {
                console.log(err)
                const error = Boom.badRequest('New user could not be added.')
                return h.response({
                    success: false,
                    response: error.output.payload,
                }).code(error.output.statusCode)
            }
        }
    });

    //Start the Hapi server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();