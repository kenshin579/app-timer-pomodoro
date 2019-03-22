#! /usr/bin/env node
'use strict'

import commander from 'commander'
import TimerPomodoro from './TimerPomodoro'
import { defaultConfig, RUNNING_MODE } from './constants'

var program = commander
  .version(require('../package.json').version)
  .name(defaultConfig.programName)
  .option('-t, --time <n>', `number of mins for countdown (default ${defaultConfig.maxCountTime})`, parseInt)
  .option('-b, --break <n>', `number of mins for break time (default ${defaultConfig.maxBreakTime})`, parseInt)
  .option('-s, --session <n>', `the max number of sessions for long-term break`, parseInt, defaultConfig.maxSession)
  .option('--stats', `show currrent stats`)
  .option('-f, --force', `ignore current setting and start the timer`)
  // .option('-d, --dtype <dtype>', 'select display type (big, small) for time format', /^(big|small)$/i, constants.timeDisplayType)
  .on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log(`  $ ${defaultConfig.programName} -h : show help usage`)
    console.log(`  $ ${defaultConfig.programName} -t 25 : start 25 mins countdown timer`)
    console.log(`  $ ${defaultConfig.programName} -t 25 -b 5 : start 25 mins countdown timer and take 5 mins break`)
    console.log(`  $ ${defaultConfig.programName} -f -t 25 -b 5 : ignore current setting and just start the timer`)
  })
  .parse(process.argv)

const userConfig = {}
if (process.argv.length <= 2) {
  program.outputHelp()
  process.exit()
}

if (commander.time && commander.break) {
  userConfig.runningMode = RUNNING_MODE.COUNTDOWN_BREAK_TIME
} else if (commander.time) {
  userConfig.runningMode = RUNNING_MODE.COUNTDOWN_TIME
} else if (commander.break) {
  userConfig.runningMode = RUNNING_MODE.BREAK_TIME
}

userConfig.maxCountTime = commander.time || defaultConfig.maxCountTime
userConfig.maxBreakTime = commander.break || defaultConfig.maxBreakTime
userConfig.maxSession = commander.session || defaultConfig.maxSession

// userConfig.timeDisplayType = commander.dtype || constants.dtype

const timerPomodoro = new TimerPomodoro(userConfig).run()

process.on('SIGINT', () => {
  console.log('\nSIGTERM signal received.')
  console.log('Terminating timer.')
  timerPomodoro.killRunningTimer()
})
