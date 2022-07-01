import Hapi from '@hapi/hapi'
import userAcountRoutes from './users-accounts';


const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: 'localhost'
    });

    //Start the Hapi server
    await server.start();
    console.log('Server running on %s', server.info.uri);

    //Load up the routes
    server.route(userAcountRoutes);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();