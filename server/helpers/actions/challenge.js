import { createMatch, updateMatch } from './match';
import sendMessage from '../slack/send_message';

export const createChallenge = async (fromUser, toUser, channel) => {
  try {
    const matchId = await createMatch(fromUser, toUser);
    const text = `<@${fromUser}> has challenged you to a match!`;
    const attachments = [{
      text: 'What would you like to do?',
      callback_id: `challenge|${matchId}`,
      attachment_type: 'default',
      actions: [{
        name: 'option',
        text: 'Accept',
        style: 'primary',
        type: 'button',
        value: 'accept',
      }, {
        name: 'option',
        text: 'Decline',
        style: 'danger',
        type: 'button',
        value: 'decline',
        confirm: {
          title: 'Are you sure?',
          ok_text: 'Yes',
          dismiss_text: 'No',
        },
      }],
    }];
    sendMessage(channel, text, attachments, toUser, false);
  } catch (err) {
    console.error(err);
  }
};

export const acceptChallenge = async (matchId, channel) => {
  try {
    const match = await updateMatch(matchId, { status: 'accepted' });
    const { challenger, opponent } = match;
    const challengerText = `<@${opponent}> has accepted your challenge! Let me know what happened with _/report_match_.`;
    const channelText = `<@${challenger}> has challenged <@${opponent}>!`;

    sendMessage(channel, challengerText, [], challenger, false);
    sendMessage(channel, channelText);
    return `You have accepted the challenge from <@${challenger}>! Let me know what happened with _/report_match_.`;
  } catch (err) {
    console.error(err);
    return 'Failed to accept challenge.';
  }
};

export const declineChallenge = async (matchId, channel) => {
  try {
    const match = await updateMatch(matchId, { status: 'declined' });
    const { challenger, opponent } = match;
    const challengerText = `<@${opponent}> has declined your challenge!`;

    sendMessage(channel, challengerText, [], challenger, false);
    return `You have declined the challenge from <@${match.challenger}>!`;
  } catch (err) {
    console.error(err);
    return 'Failed to decline challenge.';
  }
};
