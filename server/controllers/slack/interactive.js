import express from 'express';

import { acceptChallenge, declineChallenge } from '../../helpers/actions/challenge';
import { confirmReport, rejectReport } from '../../helpers/actions/report';

const interactive = express.Router().post('/', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  console.log('POST /slack/interactive', payload);
  const {
    callback_id: callbackId, actions, channel, user,
  } = payload;
  const action = actions[0];

  let replyText;
  if (callbackId.startsWith('challenge')) {
    const matchId = callbackId.split('|')[1];
    replyText = action.value === 'accept'
      ? replyText = await acceptChallenge(matchId, channel.id)
      : replyText = await declineChallenge(matchId, channel.id);
  } else if (callbackId.startsWith('report')) {
    const matchId = callbackId.split('|')[1];
    replyText = action.value === 'confirm'
      ? replyText = await confirmReport(matchId, channel.id, user.id, action.name)
      : replyText = await rejectReport(matchId, channel.id);
  } else {
    replyText = 'Unable to process action.';
  }

  return res.json({ text: replyText });
});

export default interactive;
