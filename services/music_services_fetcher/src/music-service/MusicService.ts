import { MusicTrack } from "../types/MusicTrack";
import { PlaylistData } from "../types/PlayListData";
import { SpotifyClient } from "./services/SpotifyClient";

type MusicServiceName = 'spotify' | 'youtube';  

export interface ICreatePlaylistData {
  id: string;
  name: string;
  url: string;
}

export interface IMusicService {
  playlistName: string;
  playlistId: string;
  tracks: MusicTrack[];

  createPlaylist(): Promise<ICreatePlaylistData>
  deletePlaylist(): Promise<void>
}


export class MusicService implements IMusicService {
  playlistName: string;
  playlistId: string;
  tracks: MusicTrack[];
  private musicServiceClient;

  constructor(name: MusicServiceName, playlistData: PlaylistData ) {
    this.playlistName = playlistData.name;
    this.playlistId = playlistData.id;
    this.tracks = playlistData.tracks;
    this.musicServiceClient = this.getMusicServiceClient(name);
  }

  async createPlaylist(): Promise<ICreatePlaylistData> {
    const playlistData = await this.musicServiceClient.createPlaylist(this.playlistName);

    return playlistData;
  }

  async deletePlaylist(): Promise<void> {
    await this.musicServiceClient.deletePlaylist();
  }

  private getMusicServiceClient(musicServiceName: MusicServiceName) {
    switch(musicServiceName) {
      case 'spotify':
        return new SpotifyClient();
      // case 'youtube':
      //   return new Youtube.Client()(playlistId, playlistName);
      default:
        throw new Error('Unknown music service');
    }   
  }
}
