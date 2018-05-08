[![CircleCI](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master.svg?style=svg&circle-token=2d19ab43f02c9fffd9ac06fd3fe241b0bad2f214)](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master)
[![codecov](https://codecov.io/gh/VividCortex/grafana-datasource/branch/develop/graph/badge.svg?token=GbWKRAvo3O)](https://codecov.io/gh/VividCortex/grafana-datasource)

# VividCortex Metrics Datasource Plugin

## How to use

Clone or download the repository files and place them in your Grafana plugins folder, typically found in `data/plugins`.
Restart Grafana, log in, and go to **Configuration** > **Data Sources** > **Add data source** and configure your VividCortex API Token.

## Generating an API Token

In your VivivCortex dashboard, go to Settings, Api Tokens and generate a new one.

## Development guide

1.  Place this project in your plugins directory or _<grafana folder>/data/plugins_
2.  Install dependencies. `yarn install` or `npm install`
3.  Run the tests. `yarn test` or `npm run test`
4.  Build to distribute or test. `yarn build` or `npm run build`
5.  Alternatively, use the watch script with `yarn watch` or `npm run watch`

### Coding style

The code is automatically formatted using [Prettier](https://prettier.io/) in a pre-commit hook.

### Code linting

Run the linter with `yarn lint` or `npm run lint`.

### Contribute

Change the files as you need and send a PR with no build files on it. After you get your PR approved
you can merge it to master.

### Release

We follow the [Semantic Versioning](https://semver.org/) guidelines. Depending on the type of release,
you can run:

* For patches: `yarn release:patch` or `npm run release:patch`
* For minor releases: `yarn release:minor` or `npm run release:minor`
* For major releases: `yarn release:major` or `npm run release:major`
