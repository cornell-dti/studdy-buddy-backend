import * as express from 'express';

import { searchCourse } from './courses';

const app = express();

app.get('/courses', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');

    const search = req.query.search;

    if (typeof search !== 'string') {
        return res.status(400).send('Bad Request');
    }

    res.status(200).send(searchCourse(search));
});

export default app;