import { ServerRoute } from "@hapi/hapi";
import Boom from '@hapi/boom';
import { Knex } from 'knex';
import knex from '../db/knex'

type UserResponse = {
    id: string,
    user_name: string
}

const userRoutes: ServerRoute[] = [{
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
        const db: Knex = await knex();
        try {
            const data: Array<UserResponse> = await db('users').select().limit(request.query.limit || 100)
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
}]

export default userRoutes