const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const {
      id,
    } = request.params;
    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });

    if (album.source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const {
      id,
    } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const {
      id,
    } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }

  // cover
  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateAlbumCover(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/file/covers/${filename}`;

    await this._service.postAlbumCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const message = await this._service.postUserAlbumLikeById(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message,
    });

    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const message = await this._service.deleteUserAlbumLikeById(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message,
    });

    response.code(200);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const likes = await this._service.getUserAlbumLikesById(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.albumLikes,
      },
    });
    if (likes.source === 'cache') {
      response.header('X-Data-Source', 'cache');
      return response;
    }
    return response;
  }
}
module.exports = AlbumsHandler;
