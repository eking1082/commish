import { WebClient } from '@slack/client';

const { TEST_BOT_TOKEN } = process.env;
const client = new WebClient(TEST_BOT_TOKEN);

const sendMessage = async (channel, text, attachments, toUser, visible = true) => {
  try {
    let request;
    const message = { channel, text };
    if (attachments) message.attachments = attachments;

    if (visible) {
      request = client.chat.postMessage;
    } else {
      if (!toUser) throw Error('toUser required for ephemeral messages');
      request = client.chat.postEphemeral;
      message.user = toUser;
    }

    const response = await request(message);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default sendMessage;
