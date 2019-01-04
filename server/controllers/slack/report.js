import express from 'express';

import { parseMentionedUsers, parseScore } from '../../helpers/slack/parsers';
import { getUserMatches } from '../../helpers/actions/user';
import { confirmReportWithOpponent } from '../../helpers/actions/report';

const report = express.Router().post('/', async (req, res) => {
  console.log('POST /slack/report', req.body);
  const { text, user_id: user, channel_id: channel } = req.body;

  const score = text.split(' ')[1];
  const { userScore, opponentScore } = parseScore(score);
  if (!userScore || !opponentScore) return res.json({ text: 'Unable to read score.' });

  const users = parseMentionedUsers(text);
  if (users.length !== 1) return res.json({ text: 'You must provide an opponent.' });
  const opponent = users[0].userId;

  try {
    const matches = await getUserMatches(user);
    const match = matches.find(m => m.status === 'accepted'
      && (m.challenger === opponent || m.opponent === opponent));
    if (!match) return res.json({ text: 'No match found.' });

    confirmReportWithOpponent(match.rowId, userScore, opponentScore, user, opponent, channel);
    return res.json({ text: 'Match report submitted to your opponent.' });
  } catch (err) {
    console.error(err);
    return res.json({ text: 'Unable to report match.' });
  }
});

export default report;
