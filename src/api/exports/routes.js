const routes = (handler) => [
    {
        method: 'POST',
        path: '/exports/playlists/{playlistId}',
        handler: handler.postExportsPlaylistsHandler,
        options: {
            auth: 'playlists_jwt',
        },
    },
];

module.exports = routes;