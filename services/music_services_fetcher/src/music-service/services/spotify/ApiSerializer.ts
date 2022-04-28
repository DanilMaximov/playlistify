import { ICreatePlaylistData } from "../../MusicService";

export class ApiSerializaer {
  public static serializePlaylistData(responseData): ICreatePlaylistData {
    return {
      id: responseData.id,
      name: responseData.name,
      url: responseData.external_urls.spotify,
    } as ICreatePlaylistData;
  }
}