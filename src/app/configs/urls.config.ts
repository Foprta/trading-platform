export class URLS_CONFIG {
    static get BASE_URL(): string {
        return 'http://localhost';
    }

    static get SERVER_URL(): string {
        return `${URLS_CONFIG.BASE_URL}:3000`;
    }

    static get SOCKET_URL(): string {
        return `${URLS_CONFIG.BASE_URL}:8080`;
    }

    static get SOCKET_SECURED_URL(): string {
        return `${URLS_CONFIG.SOCKET_URL}/secured`;
    }

    static get SERVER_SECURED_URL(): string {
        return `${URLS_CONFIG.SERVER_URL}/secured`;
    }

    static get AUTH_URL(): {
        LOGIN: string,
        REGISTER: string,
    } {
        const BASE_AUTH_URL: string = `${URLS_CONFIG.SERVER_URL}/auth`

        return {
            LOGIN: `${BASE_AUTH_URL}/login`,
            REGISTER: `${BASE_AUTH_URL}/register`
        }
    }

    static get BINANCE_URL(): {
        CANDLES: string,
    } {
        const BASE_AUTH_URL: string = `${URLS_CONFIG.SERVER_SECURED_URL}/binance`

        return {
            CANDLES: `${BASE_AUTH_URL}/candles`,
        }
    }
}