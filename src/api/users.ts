import { ServerRoute } from "@hapi/hapi";
import Boom from '@hapi/boom';
import * as graph from 'graphql-request'

type UserResponse = {
    id: string,
    user_name: string
}

const userRoutes: ServerRoute[] = [{
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
        const query = graph.gql`{
            allUsers {
              nodes {
                id
                nodeId
                userName
              }
              totalCount
            }
          }`
        
        try {
            const result: Array<UserResponse> = await 
                graph
                 .request('http://localhost:8000/graphql', query, null, request.headers)

            return h.response({
                success: true,
                response: {
                    message: 'Query executed successfully.',
                    data: result
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