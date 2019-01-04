const validateChallenge = (users, fromUser) => {
  // TODO: prevent challenging bot
  if (users.length > 1) return 'You can only challenge one user.';
  if (users.length === 0) return 'You have to provide a user to challenge.';
  // if (users[0].userId === fromUser.userId) return 'You can\'t challenge yourself.';
  return null;
};

export default validateChallenge;
