[![CircleCI](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master.svg?style=svg&circle-token=2d19ab43f02c9fffd9ac06fd3fe241b0bad2f214)](https://circleci.com/gh/VividCortex/grafana-datasource/tree/master)
[![codecov](https://codecov.io/gh/VividCortex/grafana-datasource/branch/develop/graph/badge.svg?token=GbWKRAvo3O)](https://codecov.io/gh/VividCortex/grafana-datasource)

# SolarWinds DPM Metrics Datasource Plugin

## How to use

First, clone or download this repository's files and place them in your Grafana plugins folder, typically found in `<path/to/grafana>/data/plugins` or, on Linux systems, the plugin directory is `/var/lib/grafana/plugins`. You can place them in a DPM folder, such as `/var/lib/grafana/plugins/dpm/`.

Restart Grafana, log in, and go to **Configuration** > **Data Sources** > **Add data source**:

![Add a Data Source](https://docs.vividcortex.com/img/docs/grafana-add-datasource.png)

Select SolarWinds DPM:

![Select SolarWinds DPM](https://docs.vividcortex.com/img/docs/grafana-datasource-selection.png)

Enter your DPM API token. To generate an API token, log into SolarWinds DPM and select the environment you want to pull metrics from. Go to Settings, and under Environment Settings, choose API Tokens.

![Enter API Token](https://docs.vividcortex.com/img/docs/grafana-datasource-vividcortex.png)

Then Save.

**Optional:** if, for any reason, you need to configure a different API URL, you can use the `API URL` field in the datasource configuration. Otherwise you can leave it empty, as it's not required.

### Configuring your graph

In the panel configuration, select the SolarWinds DPM Data Source:

![Use the SolarWinds DPM Data Source](https://docs.vividcortex.com/img/docs/grafana-select-vividcortex.png)

You will see a row with a dropdown (to select the metric) and a text input (to filter your hosts).

The dropdown will show metrics that match what you have typed, which makes searching easier:

![Metric Autocomplete](https://docs.vividcortex.com/img/docs/grafana-metric-names.png)

The hosts filter shares some features with the DPM app:

* By default, if you type _api_, any host whose name includes the substring _api_ will become part of the set of active hosts.
* You can match hostnames exactly by wrapping them with the double quotes sign. The string _"api2"_, for example, will match a host named _api2_ but not one named _api20_.
* You can exclude hosts from the selection by negating them with a minus sign. For example, _-"api20"_.
* You can select hosts by their type (os, mysql, pgsql, redis and mongo at present), with syntax such as _type=os_ or _type=mysql_.

Select a metric, filter your desired hosts and click on the `eye` icon to preview.

[Learn more about metric categories](https://docs.vividcortex.com/general-reference/metric-categories/)

Sample configuration:

![sample configuration](https://user-images.githubusercontent.com/1069378/39949018-ec4c424c-554e-11e8-8927-181d94c4a100.png)

### Use with Grafana variables

When defining a graph, it's supported in both the metric picker and host filter the use of variables.
These variables will be interpolated with the currently selected value when the datasource requests for data.

![variables in the query editor](https://user-images.githubusercontent.com/1069378/52145867-f9124f80-2640-11e9-920e-5ed3e314bf13.png)

Variables, with SolarWinds DPM as the datasource, will use the `query` field to match with metric names
(e.g. `mysql.` will match with mysql metrics). Alternatively, you can use the special string `$hosts`
and get host names as possible values.

Read more about variables in the [Grafana documentation](http://docs.grafana.org/reference/templating/).

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

## Acknowledgments

* CSS loading spinner by [Luke Haas](https://projects.lukehaas.me/css-loaders/)
