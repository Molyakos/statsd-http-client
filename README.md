# StatsD HTTP Client

StatsD HTTP client with REST interface for using in browsers.

## Installation

```
$ npm install statsd-http-client
```

## Usage

All initialization parameters are optional.

Parameters (specified as an options hash):
* `scheme`:         The scheme of address `default: http`
* `address`:        The address to send stats to `default: ''`. Example: mysite.com. Address has higher priority than host:port.
* `host`:           The host to send stats to `default: 127.0.0.1`
* `port`:           The port to send stats to `default: 9876`
* `prefix`:         What to prefix each stat name with `default: ''`
* `suffix`:         What to suffix each stat name with `default: ''`
* `useDebounce`:    Use debounce for gather batches? `default: true`
* `debounceTime`:   Debounce time in ms `default: 1000`
* `token`:          JWT token secret `default: none`

```javascript
import { Config, StatsD } from 'statsd-http-client';

const config: Config = {...};
const client = new StatsD(config);

// Increment: Increments a stat by a value (default is 1). Negative numbers converts to positive.
client.increment('name', 3);
// Decrement: Decrement a stat by a value (default is -1). Positive numbers converts to negative.
client.decrement('name', -2);
// Gauge: Gauge a stat by a specified amount (default is 1). Negative numbers converts to positive.
client.gauge('name', 5);
// Shift: Shift a stat by a specified amount (default is -1). Positive numbers converts to negative.
client.shift('name', 4);
// Timing: sends a timing command with the specified milliseconds. Negative numbers converts to positive.
client.timing('name', 500);
// Set: Counts unique occurrences of a stat (alias of unique) (default is 1).
client.set('name', 20);
```
