import express from 'express';
import path from 'path';
import {promises as fs} from 'fs';


import __dirname  from './dirname.js';
import cookieParser  from 'cookie-parser';
import cors  from 'cors';
import logger  from 'morgan';

import apiRouter  from './routes/mock-api.js';

const app = express();
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.get('/js/SmartForm.esm.js', async (req, res, next) => {
    try {
        const contents = await fs.readFile(
            path.join(__dirname, "../dist/SmartForm.esm.js")
        );
        res
            .setHeader("Content-Type", "text/javascript")
            .send(contents)
        ;
    } catch (err) {
        next();
    };
});


app.use('/api', apiRouter);

app.use(function (req, res, next) {
  res.status(404).json({message: "We couldn't find what you were looking for 😞"})
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json(err)
})

export default app;
