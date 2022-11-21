# wistful

[![NPM version](https://img.shields.io/npm/v/wistful)](https://www.npmjs.com/package/wistful)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ChrisCarleton/wistful/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/ChrisCarleton/wistful/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/ChrisCarleton/wistful/badge.svg?branch=master)](https://coveralls.io/github/ChrisCarleton/wistful?branch=master)

A handy tool for pretty-printing the JSON-formatted output from your Winston logs.

![Wistful in action](screenshot.png)

## Usage

Install globally

```bash
npm install -g wistful

# or

yarn global add wistful
```

Then you can pipe log files...

```bash
wistful < logs.txt
```

Or even pipe the log output from your apps in real-time...

```bash
node src/index.js | wistful
```
