# Timer Pomodoro

> This is a simple command line based Pomodoro Timer with pop-up notification

## Feature

- Keep track of number of working session
- Make sure long-term break time is taken after reaching the maximum session (ex. 4 times)

## Table of Contents

- [Install](#Install)
- [Usage](#Usage)
- [Todo](#Todo)
- [References](#References)
- [License](#License)

## Install

```sh
$ npm install -g timer-pomodoro
```

Or after download the source code from git repository

```sh
$ git clone https://github.com/kenshin579/app-timer-pomodoro
$ cd app-timer-pomodoro
$ npm install
```

## Usage
You can type `timer-pomodoro` to see the help usage:

```sh
$ timer-pomodoro
Usage: timer-pomodoro [options]

Options:
  -V, --version      output the version number
  -t, --time [n]     the number of mins for countdown (default: 25)
  -b, --break [n]    the number of mins for break time (default: 5)
  -l, --long [n]     the number of mins for long-term break (default: 15)
  -s, --session [n]  the max number of sessions for long-term break (default: 4)
  -h, --help         output usage information

Examples:
  $ timer-pomodoro -h : show help usage
  $ timer-pomodoro -t : start 25 mins countdown timer
  $ timer-pomodoro -t 30 : start 30 mins countdown timer
  $ timer-pomodoro -t -b : start countdown and break timer with default value
  $ timer-pomodoro -t 25 -b 10 : start 25 mins countdown timer and take 10 mins break
  $ timer-pomodoro -t 25 -b 10 -s 5: start 25 mins countdown timer and take 10 mins break (repeats 5 times)
```

You can start Pomdoro timer of 20 minutes : 
```sh
$ timer-pomodoro -t 20
```


You can start Pomodoro timer with break time as well :
```sh
$ timer-pomodoro -t 20 -b 5
```

## Todo - Anyone can contribute
- [ ] Localize pop-up messages (only Korean available)
- [ ] Add option to display timer differently (ex. bigger font)

## References
* console-countdown, https://www.npmjs.com/package/console-countdown
* pomd, https://www.npmjs.com/package/pomd
* pomodoro, https://www.npmjs.com/package/pomodoro

## License
MIT   
