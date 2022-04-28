import redisClient from './redisClient';

export class TokenStorage {
  // implement enum with services names

  public static async getToken(service: string): Promise<string> {
    return new Promise((resolve, reject) => {
      redisClient.get(service, (err, reply) => { // eslint-disable-line
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public static async setToken(service: string, token: string, expirationTime: number): Promise<string> {
    return new Promise((resolve, reject) => {
      redisClient.set(service, token, 'EX', expirationTime, (err, reply) => { // eslint-disable-line
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}
