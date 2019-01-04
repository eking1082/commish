import { updateMatch } from './match';
import sendMessage from '../slack/send_message';

export const confirmReportWithOpponent = (
  matchId, userScore, opponentScore, user, opponent, channel,
) => {
  let winner;
  let loser;
  let winnerScore;
  let loserScore;
  if (userScore > opponentScore) {
    winner = user;
    loser = opponent;
    winnerScore = userScore;
    loserScore = opponentScore;
  } else {
    winner = opponent;
    loser = user;
    winnerScore = opponentScore;
    loserScore = userScore;
  }

  const text = `<@${user}> has reported your match!`;
  const attachments = [{
    text: `<@${user}> ${userScore} - ${opponentScore} <@${opponent}>`,
    callback_id: `report|${matchId}`,
    attachment_type: 'default',
    actions: [{
      name: `${winner}|${loser}|${winnerScore}|${loserScore}`,
      text: 'Confirm',
      style: 'primary',
      type: 'button',
      value: 'confirm',
    }, {
      name: 'option',
      text: 'Reject',
      style: 'danger',
      type: 'button',
      value: 'reject',
      confirm: {
        title: 'Are you sure?',
        ok_text: 'Yes',
        dismiss_text: 'No',
      },
    }],
  }];
  sendMessage(channel, text, attachments, opponent, false);
};

export const confirmReport = async (matchId, channel, user, reportInfo) => {
  const [winner, loser, winnerScore, loserScore] = reportInfo.split('|');
  const match = await updateMatch(matchId, {
    winner,
    winnerScore,
    loserScore,
    status: 'completed',
  });
  const { challenger, opponent } = match;
  const reporter = user === challenger ? opponent : challenger;
  const reporterText = `<@${user}> has confirmed your report.`;
  const channelText = `<@${winner}> has defeated <@${loser}> (${winnerScore} - ${loserScore})`;

  sendMessage(channel, reporterText, [], reporter, false);
  sendMessage(channel, channelText);
  return 'Report confirmed!';
};

export const rejectReport = (matchId, channel) => {
};
