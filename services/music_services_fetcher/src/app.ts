import { MusicService } from "./music-service/MusicService";

export const lambdaHandler = async (event: any) => {
  const { playlist, musicService } = event
  const service = new MusicService(musicService.name, playlist);

  const response = service.createPlaylist();

  return {
    statusCode: 200,
    body: response
  };
}

const mockPlaylistName = "Test Playlist";
const mockPlaylistId = "1";
const mockEvent = {
  playlist: {
    name: mockPlaylistName,
    id: mockPlaylistId,
    tracks: []
  },
  musicService: {
    name: "spotify"
  }
};

const lambdaResponse = lambdaHandler(mockEvent)

console.log(lambdaResponse);