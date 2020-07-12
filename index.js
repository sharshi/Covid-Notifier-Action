const https = require('https');
const core = require("@actions/core");

const yourWebHookURL = core.getInput("URL");
const stateInput = core.getInput("STATE");
const covidAPIUrl = "https://covidtracking.com/api/v1/states/current.json";

const sendSlackMessage = (webhookURL, messageBody) => {
  try {
    messageBody = JSON.stringify(messageBody);
  } catch (e) {
    throw new Error('Failed to stringify messageBody', e);
  }

  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(webhookURL, requestOptions, res => {
      let response = '';
      res.on('data', d => response += d);
      res.on('end', () => resolve(response))
    });

    req.on('error', e => reject(e));

    req.write(messageBody);
    req.end();
  });
}

(async () => {
  if (!yourWebHookURL) console.error('Please fill in your Slack Webhook URL')

  await https.get(covidAPIUrl, async res => {
    var body = '';

    res.on('data', chunk => body += chunk);

    res.on('end', async () => {
      const text = JSON.parse(body).filter(item => item.state === stateInput)

      const { state, positive, death, recovered, positiveIncrease } = text[0];

      const userAccountNotification = {
        text: `State: ${state}\nPositive: ${positive}\nRecovered: ${recovered}\nDeath: ${death}\nNew Cases: ${positiveIncrease}`
      };

      console.log('Sending slack message');
      try {
        const slackResponse = await sendSlackMessage(yourWebHookURL, userAccountNotification);
        console.log('Message response', slackResponse);
      } catch (e) {
        console.error('There was a error with the request', e);
      }
    });
  })
})();