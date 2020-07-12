# covid-notifier
GitHub Action for sending Covid data to Slack

## Inputs

### `URL`

**Required** Slack webhook

### `STATE`

**Required** Two–Letter US State Abbreviation (ie: NY or CA)

## Example usage
```
uses: sharshi/covid-notifier-action@v0.1.0
with:
  URL: slack.webhook.url
  STATE: NY
```
