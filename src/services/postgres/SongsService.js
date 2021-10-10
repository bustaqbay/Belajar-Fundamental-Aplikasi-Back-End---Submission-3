const { nanoid } = require("nanoid");
const { Pool } = require("pg");

const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addSong({ title, year, performer, genre, duration }) {
        const id = `songs-${nanoid(16)}`;
        const insertedAt = new Date().toDateString();
        const updatedAt = insertedAt;

        const query = {
            text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        await this._cacheService.delete('songs');

        return result.rows[0].id;
    }

    async getSongs() {
        try {
            const result = await this._cacheService.get('songs');
            return JSON.parse(result);
        } catch (error) {
            const result = await this._pool.query('SELECT id, title, performer FROM songs');

            await this._cacheService.set('songs', JSON.stringify(result.rows));

            return result.rows.map(mapDBToModel);
        }

    }

    async getSongById(id) {
        try {
            const result = await this._cacheService.get(`songs:${id}`);
            return JSON.parse(result);
        } catch (error) {
            const query = {
                text: 'SELECT * FROM songs WHERE id = $1',
                values: [id],
            };
            const result = await this._pool.query(query);
    
            if(!result.rowCount) {
                throw new NotFoundError('Lagu tidak ditemukan');
            }
            
            await this._cacheService.set(`song:${id}`, JSON.stringify(result.rows.map(mapDBToModel)[0]));

            return result.rows.map(mapDBToModel)[0];
        }
    }

    async editSongById(id, {title, year, performer, genre, duration} ) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        };
        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Gagal memperbaharui lagu. Id tidak ditemukan');
        }

        await this._cacheService.delete(`songs:${id}`);
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }

        await this._cacheService.delete(`song:${id}`);
        await this._cacheService.delete('songs');
    }
}

module.exports = SongsService;