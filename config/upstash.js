import { Client } from '@upstash/qstash';
import { QSTASH_TOKEN } from './env.js';

const workflowClient = new Client({
    token: QSTASH_TOKEN
});

export default workflowClient;