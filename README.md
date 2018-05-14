[![CircleCI](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master.svg?style=svg&circle-token=2d19ab43f02c9fffd9ac06fd3fe241b0bad2f214)](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master)
[![codecov](https://codecov.io/gh/VividCortex/grafana-datasource/branch/develop/graph/badge.svg?token=GbWKRAvo3O)](https://codecov.io/gh/VividCortex/grafana-datasource)

# VividCortex Metrics Datasource Plugin

## How to use

Clone or download the repository files and place them in your Grafana plugins folder, typically found in `<path/to/graphana>/data/plugins` or, on Linux systems, the plugin directory is `/var/lib/grafana/plugins`.
Restart Grafana, log in, and go to **Configuration** > **Data Sources** > **Add data source** and configure your VividCortex API Token.

### Generating an API Token

In your VivivCortex dashboard, go to Settings, Api Tokens and generate a new one.

### Configuring your graph

In the panel configuration, after selecting your VividCortex Datasource, you will see a row with a dropdown (to select the metric) and a text input (to filter your hosts).

The metrics dropdown has an autocomplete feature, which will fetch more values (if available) after entering a period. For example `host.` will autocomplete to `host.queries`, `host.indexes`, etc.

The hosts filter shares some features with the VividCortex app:

* By default, if you type _api_, any host whose name includes the substring _api_ will become part of the set of active hosts.
* You can match hostnames exactly by wrapping them with the double quotes sign. The string _"api2"_, for example, will match a host named _api2_ but not one named _api20_.
* You can exclude hosts from the selection by negating them with a minus sign. For example, _-"api20"_.
* You can select hosts by their type (os, mysql, pgsql, redis and mongo at present), with syntax such as _type=os_ or _type=mysql_.

Select a metric, filter your desired hosts and click on the `eye` icon to preview.

[Learn more about metric categories](https://docs.vividcortex.com/general-reference/metric-categories/)

Sample configuration:

![sample configuration](https://user-images.githubusercontent.com/1069378/39949018-ec4c424c-554e-11e8-8927-181d94c4a100.png)

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
