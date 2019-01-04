import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import slackChallenge from './controllers/slack/challenge';
import slackReport from './controllers/slack/report';
import slackInteractive from './controllers/slack/interactive';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/slack/challenge', slackChallenge);
app.use('/slack/report', slackReport);
app.use('/slack/interactive', slackInteractive);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
