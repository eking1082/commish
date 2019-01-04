export const parseMentionedUsers = (text) => {
  const regex = RegExp(/(?<=<@)(.*?)(?=>)/, 'g');
  const users = [];
  let result;

  do {
    result = regex.exec(text);
    if (result) {
      const [userId, username] = result[0].split('|');
      users.push({
        userId,
        username,
      });
    }
  } while (result !== null);

  return users;
};

export const parseScore = (score) => {
  if (score.match(/\d*-\d*/g)[0] !== score) return {};

  const [userScore, opponentScore] = score.split('-');
  return { userScore, opponentScore };
};
