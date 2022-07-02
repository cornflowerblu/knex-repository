import Hapi from '@hapi/hapi'
import userRoutes from './api/users';
import userAccountRoutes from './api/users-accounts';
import http from 'http'
import { postgraphile } from 'postgraphile'
import coreUserRoutes from './api/core-users';


const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: 'localhost'
    });

    //Spin up the plugins
    await server.register({
        plugin: require('./plugins/auth').default,
    });

    //Start the Hapi server
    await server.start();
    console.log('Server running on %s', server.info.uri);

    //Load up the routes
    server.route(userAccountRoutes);
    server.route(userRoutes);
    server.route(coreUserRoutes);

    //Spin up GraphQL
    http
    .createServer(
        postgraphile(
        process.env.DATABASE_URL || "postgres://postgres:postgrespw@localhost:55000/postgres",
        "public",
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            jwtPgTypeIdentifier: 'public.jwt_token',
            jwtSecret: 'thegreatestandbestsecretintheworld',
            pgDefaultRole: 'no_access_role'
        })
    )
    .listen(process.env.PORT || 8000);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();