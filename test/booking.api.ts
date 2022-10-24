import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { authentication } from '../support/authenticate.ts';

const CounterErrors = new Counter('Errors');

export const options = {
    stages: [
        { duration: '30s', target: 1 }, // high load duration: '2m', target: 500
    ],
    thresholds: { Errors: ['count<100'] },
};

export function setup() {
    return authentication();
}

export default function bookingApi(authData) {
    const authToken = authData.accessToken;
    const ApiUrl = `${authData.envConfig.baseUrl}/booking/1`;

    const authorization = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    };

    const ApiResponse = http.get(ApiUrl, authorization);

    console.log('retrieving bookings 🔥');

    check(ApiResponse, {
        'status is 200': (response) => response.status === 200
    });

    if (ApiResponse.status !== 200) {
        CounterErrors.add(1);
    }

    console.log('item count is', ApiResponse.json('itemsCount'));

    // sleep(1)
}
