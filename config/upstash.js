import { Client } from '@upstash/qstash';
import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

const workflowClient = new Client({
    token: QSTASH_TOKEN,
    baseUrl: QSTASH_URL
});

export default workflowClient;