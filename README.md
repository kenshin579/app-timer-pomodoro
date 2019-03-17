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

If you want to use sound file (ex.'Clock-chimes') instead of using the default system, then copy the  
sound file to the following location those of you who are using the MacOS.   

```sh
$ cp /usr/local/lib/node_modules/timer-pomodoro/sound/Clock-chimes.mp3 ~/Library/Sounds
```

## Usage
You can type `timer-pomodoro` to see the help usage:

```sh
$ timer-pomodoro
Usage: timer-pomodoro [options]

Options:
  -V, --version      output the version number
  -t, --time <n>     number of mins for countdown (default 25)
  -b, --break <n>    number of mins for break time (default 5)
  -s, --session <n>  the max number of sessions for long-term break (default: 4)
  -h, --help         output usage information

Examples:
  $ timer-pomodoro -h
  $ timer-pomodoro -t 20
  $ timer-pomodoro -t 20 -b 5
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
