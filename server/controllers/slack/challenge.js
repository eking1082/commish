import express from 'express';

import { parseMentionedUsers } from '../../helpers/slack/parsers';
import validateChallenge from '../../helpers/validators/challenge';
import { createChallenge } from '../../helpers/actions/challenge';

const challenge = express.Router().post('/', (req, res) => {
  console.log('POST /slack/challenge', req.body);
  const { text, user_id: fromUser, channel_id: channel } = req.body;
  const users = parseMentionedUsers(text);
  const error = validateChallenge(users, fromUser);
  if (error) return res.json({ text: error });

  const toUser = users[0];
  createChallenge(fromUser, toUser.userId, channel);
  return res.json({ text: `Your challenge has been sent to <@${toUser.userId}>.` });
});

export default challenge;
