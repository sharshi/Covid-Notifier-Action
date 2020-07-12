const https = require('https');
const core = require("@actions/core");

const yourWebHookURL = core.getInput("URL");
const stateInput = core.getInput("STATE");
const covidAPIUrl = "https://covidtracking.com/api/v1/states/current.json";

const slack = require('./slack');

(async () => {
  if (!yourWebHookURL) console.error('Please fill in your Slack Webhook URL')

  await https.get(covidAPIUrl, async res => {
    var body = '';

    res.on('data', chunk => body += chunk);

    res.on('end', async () => {
      const selectedState = JSON.parse(body).filter(item => item.state === stateInput)

      const { 
        state, 
        positive, 
        death, 
        recovered, 
        positiveIncrease
      } = selectedState[0];

      const text = 
      `State: ${state}\nPositive: ${positive}\nRecovered: ${recovered}\nDeath: ${death}\nNew Cases: ${positiveIncrease}`;

      const message = {
        text
      };

      console.log('Sending slack message\n', text);

      try {
        const slackResponse = await slack(yourWebHookURL, message);
        console.log('Message response', slackResponse);
      } catch (e) {
        console.error('There was a error with the request', e);
      }
    });
  })
})();