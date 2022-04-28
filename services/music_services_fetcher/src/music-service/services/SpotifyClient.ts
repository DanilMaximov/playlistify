import { ICreatePlaylistData } from "../MusicService";
import { ApiHandler } from "./spotify/ApiHandler";
import { ApiSerializaer } from "./spotify/ApiSerializer";

export class SpotifyClient {

  private readonly apiHandler: ApiHandler;

  constructor() {
    this.apiHandler = new ApiHandler();
  }

  async createPlaylist(playlistName: string): Promise<ICreatePlaylistData> {
    const result = await this.apiHandler.createPlaylist(playlistName);
    const playlistData = ApiSerializaer.serializePlaylistData(result);

    return playlistData;
  }

  async deletePlaylist(playlistName: string): Promise<void> {
    await this.apiHandler.deletePlaylist(playlistName);
  }
}
