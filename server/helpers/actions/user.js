import db, { listToArray } from '../firebase/firebase';

// eslint-disable-next-line import/prefer-default-export
export const getUserMatches = async (userId) => {
  const snapshot = await db.ref(`/user-matches/${userId}`).once('value');
  return listToArray(snapshot);
};
