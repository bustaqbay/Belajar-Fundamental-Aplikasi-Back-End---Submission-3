class ExportsHandler {
    constructor(exportsService, playlistsService, validator) {
        this._exportsService = exportsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postExportsPlaylistsHandler = this.postExportsPlaylistsHandler.bind(this);
    }

    async postExportsPlaylistsHandler(request, h) {
        this._validator.validateExportsPlaylistsValidator(request.payload);

        const { playlistId } = request.params;
        const userId = request.auth.credentials.id;

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        const message = {
            userId,
            targetEmail: request.payload.targetEmail,
            playlistId,
        };

        await this._exportsService.sendMessage('exports:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrian',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;