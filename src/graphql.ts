import http from 'http'
import { postgraphile } from 'postgraphile'

//Spin up GraphQL
export default async function InitGraphQL(){
    http
    .createServer(
        postgraphile(
        "postgres://postgres:postgrespw@0.0.0.0:55004/postgres",
        "public",
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            jwtPgTypeIdentifier: 'public.jwt_token',
            jwtSecret: 'thegreatestandbestsecretintheworld',
            pgDefaultRole: 'no_access_role',
            retryOnInitFail: true
        })
    )
    .listen(process.env.PORT || 8000);  
}