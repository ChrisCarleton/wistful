# wistful

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
