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
  // .option('-d, --dtype <dtype>', 'select display type (big, small) for time format', /^(big|small)$/i, constants.timeDisplayType)
  .on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log(`  $ ${defaultConfig.programName} -h`)
    console.log(`  $ ${defaultConfig.programName} -t 25`)
    console.log(`  $ ${defaultConfig.programName} -t 25 -b 5`)
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
