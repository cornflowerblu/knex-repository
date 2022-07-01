import Hapi from '@hapi/hapi'
import userRoutes from './api/users';
import userAcountRoutes from './api/users-accounts';
import http from 'http'
import { postgraphile } from 'postgraphile'


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
    server.route(userAcountRoutes);
    server.route(userRoutes);

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

        })
    )
    .listen(process.env.PORT || 8000);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();