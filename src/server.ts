import Hapi from '@hapi/hapi'
import userRoutes from './api/users';
import userAccountRoutes from './api/users-accounts';
import coreUserRoutes from './api/core-users';
import InitGraphQL from './graphql';


const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: '0.0.0.0',
        routes: {
            cache: false,
        },
    });

    //Spin up the plugins
    await server.register({
        plugin: require('./plugins/auth').default,
    });

    //Start the Hapi server
    await server.start();
    console.log('Server running on %s', server.info.uri);

    //Load up the routes
    server.route({
        method: 'GET',
        path: '/hello',
        handler: (_request, h) => {
            return h.response('Hello World')
        }
    })
    server.route(userAccountRoutes);
    server.route(userRoutes);
    server.route(coreUserRoutes);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init()
    .then()
        InitGraphQL()
            .finally()
                console.log('GraphQL Initialized')