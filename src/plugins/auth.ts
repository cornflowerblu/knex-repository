import { Plugin } from 'hapi__hapi';
import * as Boom from '@hapi/boom';
import _ from 'lodash';

const authPlugin: Plugin<null> = {
    name: 'auth',
    register: async (server) => {
        server.auth.scheme('key', (server, options) => {
            return {
                authenticate: (req, h) => {
                    if (_.isEmpty(req.query.api_key) || req.query.api_key !== 'kksdhgiushu887') {
                        return Boom.forbidden('Must supply valid api_key');
                    }
                    return h.authenticated({ credentials: {} });
                },
            };
        });
        server.auth.strategy('key', 'key');
    }
}

export default authPlugin;