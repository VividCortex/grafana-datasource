# VividCortex Metrics Datasource Plugin

## How to use

Clone or download the repository files and place them in your Grafana plugins folder, typically found in `data/plugins`.
Login to Grafana and go to **Configuration** > **Data Sources** > **Add data source** and configure your VividCortex API Token.

## Generating an API Token

Inside your VivivCortex account, go to Settings, Api Tokens and generate a new one.

## Development guide

1. Place this project in your plugins directory or _<grafana folder>/data/plugins_
2. Install dependencies. `yarn install` or `npm install`
3. Build to distribute. `yarn grunt` or `npm run grunt`