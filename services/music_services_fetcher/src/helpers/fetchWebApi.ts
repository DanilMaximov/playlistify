import axios from 'axios'

type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

export class FetchWebApi {
  url: string;
  query: any;
  body: any;
  headers: any;
  auth: any;
  method: Method;

  constructor() {
    this.url = '';
    this.query = {};
    this.body = {};
    this.headers = {
      'Content-Type': 'application/json'
    };
    this.auth = '';
    this.method = 'get';
  }

  withUrl(url: string): this {
    this.url = url;
    return this;
  }

  withQuery(query: any): this {
    this.query = query;
    return this;
  }

  withBody(body: any): this {
    this.body = body;
    return this;
  }

  withHeaders(headers: any): this {
    this.headers = {...this.headers, ...headers};
    return this;
  }

  withAuth(auth: any): this {
    this.headers = {...this.headers, Authorization: auth};
    return this;
  }

  withMethod(method: Method): this {
    this.method = method;
    return this;
  }

  async execute(): Promise<any> {
    const url = this.url
    const method = this.method;
    const headers = this.headers;
    const body = this.body;
    const params = this.query;

    console.log(method, url)

    const request = {
      url,
      method,
      headers,
      params,
      data: body,
    };

    const response = await axios(request);

    return response;
  }
}
