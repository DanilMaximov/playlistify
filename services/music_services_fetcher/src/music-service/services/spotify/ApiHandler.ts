import { FetchWebApi } from '../../../helpers/FetchWebApi';
import { TokenStorage } from '../../../helpers/TokenStorage';

//namespace Spotify {
  export class ApiHandler {
    API_URL = 'https://api.spotify.com/v1';
    RETRY_TIMEOUT = 1000;

    private authorization: Authorization;

    constructor(){
      this.authorization = new Authorization();
    }

    async createPlaylist(playlistName: string) {
      const response = await this.makeRequest(`/me/playlists`, 'post', {
        name: playlistName,
        public: false
      });

      return response;
    }

    async deletePlaylist(playlistId: string) {
      const response = await this.makeRequest(`/playlists/${playlistId}`, 'delete');

      return response;
    }

    private async makeRequest(endpoint, method, body = {}, attempt = 0): Promise<any> {
      const accessToken = await this.authorization.getAccessToken();

      const response = await new FetchWebApi()
        .withUrl(this.API_URL + endpoint)
        .withQuery('')
        .withAuth(`Bearer ${accessToken}`)
        .withMethod(method)
        .withBody(body)
        .execute();

      if (response.status === 401 && attempt < 2) {
        await this.authorization.getNewAccessToken();
        return this.makeRequest(endpoint, method, body, attempt + 1);
      }

      if (response.status === 429 && attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_TIMEOUT));
        return this.makeRequest(endpoint, method, body, attempt + 1);
      }

      return response.data;
    }
  }

  class Authorization {
    AUTHORIZATION_URL = 'https://accounts.spotify.com/api/token';
    CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    TOKEN_STORAGE_KEY = 'spotify_access_token';
    TOKEN_EXPIRATION_TIME = 3600;
  
    private readonly basicAuth = Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString('base64');
    accessToken: string;

    async getAccessToken(): Promise<string> {
      if (this.accessToken) {
        return this.accessToken;
      }

      const token = await TokenStorage.getToken(this.TOKEN_STORAGE_KEY);

      if (token) {
        this.accessToken = token;
        return token;
      }

      const newAccessToken = await this.getNewAccessToken();
      this.accessToken = newAccessToken;
      await TokenStorage.setToken(this.TOKEN_STORAGE_KEY, newAccessToken, this.TOKEN_EXPIRATION_TIME);

      return newAccessToken;
    }

    async getNewAccessToken(): Promise<any> {
      const response = await new FetchWebApi()
        .withUrl(this.AUTHORIZATION_URL)
        .withQuery({grant_type: 'client_credentials'})
        .withAuth(`Basic ${this.basicAuth}`)
        .withMethod('post')
        .withHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
        .execute()
        .catch(error => {
          console.log(error);
        });

      return response.data.access_token;
    }
  }
//}