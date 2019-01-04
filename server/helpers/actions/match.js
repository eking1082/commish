import db from '../firebase/firebase';

export const createMatch = (challenger, opponent) => {
  const matchData = {
    challenger,
    opponent,
    type: 'pong',
    status: 'pending',
    winner: '',
    date: '',
  };
  const matchId = db.ref('matches').push().key;

  const updates = {};
  updates[`/matches/${matchId}`] = matchData;
  updates[`/user-matches/${challenger}/${matchId}`] = matchData;
  updates[`/user-matches/${opponent}/${matchId}`] = matchData;

  return db.ref().update(updates).then(() => matchId);
};

export const readMatch = matchId => db.ref(`/matches/${matchId}`).once('value')
  .then(snapshot => snapshot.val());

export const updateMatch = async (matchId, updating) => {
  const matchData = await readMatch(matchId);
  const { challenger, opponent } = matchData;
  const updatedMatch = {
    ...matchData,
    ...updating,
  };

  const updates = {};
  updates[`/matches/${matchId}`] = updatedMatch;
  updates[`/user-matches/${challenger}/${matchId}`] = updatedMatch;
  updates[`/user-matches/${opponent}/${matchId}`] = updatedMatch;

  return db.ref().update(updates).then(() => updatedMatch);
};

export const deleteMatch = async (matchId) => {
  const matchData = await readMatch(matchId);
  const { challenger, opponent } = matchData;

  const updates = {};
  updates[`/matches/${matchId}`] = null;
  updates[`/user-matches/${challenger}/${matchId}`] = null;
  updates[`/user-matches/${opponent}/${matchId}`] = null;

  return db.ref().update(updates).then(() => matchData);
};
