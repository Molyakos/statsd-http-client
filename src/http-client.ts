import axios, { AxiosRequestConfig } from 'axios';

export class HttpClient {
    post(url: string, token: string | undefined, data: any): Promise<any> {
        const config: AxiosRequestConfig = {
            url: url,
            method: 'POST',
            data: data
        };
        if (token) {
            config.headers = {
                'X-JWT-Token': token
            };
        }
        return axios(config);
    }
}
