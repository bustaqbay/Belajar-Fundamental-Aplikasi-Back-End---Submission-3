class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
        this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
        this.deletePlaylistsongsBySongidHandler = this.deletePlaylistsongsBySongidHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistValidator(request.payload);
        const { name } = request.payload;

        const { id: credentialId } = request.auth.credentials;
        const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postPlaylistsongsHandler(request, h) {
        this._validator.validatePlaylistsongsValidator(request.payload);
        const { songId } = request.payload;
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addPlaylistsongs(playlistId, songId);
        
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke dalam playlist',
        });
        response.code(201);
        return response;
    }

    async getPlaylistsongsHandler(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const songs = await this._service.getPlaylistsongs(playlistId);

        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async deletePlaylistsongsBySongidHandler(request) {
        const { playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deletePlaylistsongsBySongid(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
}

module.exports = PlaylistsHandler;