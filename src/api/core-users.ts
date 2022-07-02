import { ServerRoute } from "@hapi/hapi";
import Boom from '@hapi/boom';
import * as graph from 'graphql-request'

type CoreUserResponse = {
    id: string,
    nodeId: string,
    email: string,
    coreEmployeeByUserId: {
        familyName: string,
        givenName: string
    }
}

const coreUserRoutes: ServerRoute = {
    method: 'GET',
    path: '/users/core',
    handler: async (request, h) => {
        const query = graph.gql`{
            allCoreUsers(first: 100) {
              nodes {
                id
                nodeId
                email
                coreEmployeeByUserId {
                  familyName
                  givenName
                }
              }
              totalCount
            }
          }`
        
        try {
            const result: Array<CoreUserResponse> = await 
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
}

export default coreUserRoutes