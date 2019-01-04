import admin from 'firebase-admin';
import serviceAccount from './firebase_key.json';
// settings > service accounts > generate new private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://commish-2b296.firebaseio.com',
});

const db = admin.database();

export const listToArray = (list) => {
  const data = [];
  list.forEach((item) => {
    data.push({ rowId: item.key, ...item.val() });
  });
  return data;
};

export default db;
