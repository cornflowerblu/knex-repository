import { ServerRoute } from '@hapi/hapi'
import Boom from '@hapi/boom';
import { Knex } from 'knex';
import knex from '../db/knex'
import { z } from 'zod';


type UserAccountResponse = {
    id: string,
    user_name: string,
    account_name: string
}

// Create the validation rules with Zod then infer the type
const CreateAccountBodyValidation = z.object({
    user_name: z.string(),
    account_name: z.string()
})

type CreateAccountBody = z.infer<typeof CreateAccountBodyValidation>

const userAcountRoutes: ServerRoute[] = [{
    method: 'GET',
    path: '/users/account',
    handler: async (request, h) => {
        const db: Knex = await knex();
        try {
            const data: Array<UserAccountResponse> = await
                db('users')
                    .join('accounts', 'users.id', '=', 'accounts.user_id')
                    .select('users.id', 'users.user_name', 'accounts.account_name')
                    .limit(request.query.limit || 100)

            const count = await db('users').join('accounts', 'users.id', '=', 'accounts.user_id').count()

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
},
{
    method: 'POST',
    path: '/user/account/create',
    handler: async (request, h) => {
        const db: Knex = await knex();
        const body: CreateAccountBody = request.payload as any

        const userInput: CreateAccountBody = {
            user_name: body.user_name,
            account_name: body.account_name
        }

        try {
            CreateAccountBodyValidation.parse(userInput);
        } catch (err) {
            console.log(err)
            const error = Boom.badRequest('Invalid input was provided.')
            return h.response({
                success: false,
                response: error.output.payload,
            }).code(error.output.statusCode)
        }

        try {
            // Insert a user first and then associate an account. If account creation fails, delete user.
            const user = await db.raw(`
                    INSERT INTO public.users (user_name) 
                    VALUES('${userInput.user_name}')
                    RETURNING id;
                `)

            try {
                await db.raw(`
                    INSERT INTO public.accounts ( account_name, user_id) 
                    VALUES('${userInput.account_name}', '${user.rows[0].id}')
                `)
            } catch (err) {
                await db.raw(`
                    DELETE FROM public.users WHERE id = '${user.rows[0].id}'
            `)
                console.log(err)
                const error = Boom.badRequest('Account already exists. User was not added.')
                return h.response({
                    success: false,
                    response: error.output.payload,
                }).code(error.output.statusCode)
            }

            // Fetch the newly created user account and return it in the response
            const userAccount: Array<UserAccountResponse> =
                await db('users')
                    .join('accounts', 'users.id', '=', 'accounts.user_id')
                    .select('users.id', 'users.user_name', 'accounts.account_name')
                    .where('users.id', '=', `${user.rows[0].id}`)

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
}]

export default userAcountRoutes;