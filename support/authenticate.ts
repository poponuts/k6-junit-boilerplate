import http from 'k6/http';
import encoding from 'k6/encoding';
import { getEnvironment } from '../k6.config.ts';

export function authentication() {
    const envParams = getEnvironment(`${__ENV.ENVIRONMENT}`);
    const credentials = `${envParams.email}:${envParams.password}`;
    const url = 'https://restful-booker.herokuapp.com/auth';

    const encodedCredentials = encoding.b64encode(credentials);

    const response = http.post(url, '', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedCredentials}`,
        },
    });

    return {
        accessToken: response.json('data.accessToken'),
        envConfig: envParams,
    };
}
