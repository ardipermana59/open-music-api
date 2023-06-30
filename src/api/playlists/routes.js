const routes = (handler) => [{
  method: 'POST',
  path: '/playlists',
  handler: (request, h) => handler.postPlaylistHandler(request, h),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists',
  handler: (request) => handler.getPlaylistsHandler(request),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{id}',
  handler: (request) => handler.getPlaylistByIdHandler(request),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{id}',
  handler: (request) => handler.deletePlaylistByIdHandler(request),
  options: {
    auth: 'music_jwt',
  },
},

{
  method: 'POST',
  path: '/playlists/{playlistId}/songs',
  handler: (request, h) => handler.postPlaylistSongHandler(request, h),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{playlistId}/songs',
  handler: (request) => handler.getPlaylistSongsHandler(request),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}/songs',
  handler: (request) => handler.deletePlaylistSongByIdHandler(request),
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{id}/activities',
  handler: (request, h) => handler.getPlaylistActivitiesHandler(request, h),
  options: {
    auth: 'music_jwt',
  },
},
];

module.exports = routes;
