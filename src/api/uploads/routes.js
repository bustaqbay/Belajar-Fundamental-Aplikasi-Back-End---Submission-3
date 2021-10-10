const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadsImageHandler,
        options: {
            /*auth: {
                strategy: 'playlists_jwt',
            },*/
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 500000,
                multipart: true,
                output: 'stream',
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
          directory: {
            path: path.resolve(__dirname, 'file'),
          },
        },
    },
];

module.exports = routes;