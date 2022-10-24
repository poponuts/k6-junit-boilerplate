import {jUnit} from "k6-junit";

export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');
    return {
        "./junit.xml": jUnit(data)
    };
}

export const env = {
    test: {
        baseUrl: 'https://restful-booker.herokuapp.com',
        email: 'admin',
        password: 'password123'
    }
};

export const getEnvironment = (envName) => {
    return env[envName];
};
