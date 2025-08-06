import express from 'express';
const app = express();
import {PORT, NODE_ENV} from './config/env.js';
import {authRouter} from './routes/auth.js';
import {usersRouter} from './routes/users.js';

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.listen(PORT, () => {
    console.log(`API is running on port http://localhost:${PORT}`);
});