module.exports = (webhookURL, messageBody) => {
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
