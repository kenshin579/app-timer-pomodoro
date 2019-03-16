#! /usr/bin/env node
'use strict'

import commander from 'commander'
import TimerPomodoro from './TimerPomodoro'
import constants from './constants'

var program = commander
  .version('0.0.1')
  .name(constants.programName)
  .option('-t, --time <n>', `number of mins for countdown`, parseInt, constants.maxCountTime)
  .option('-b, --break <n>', `number of mins for break time`, parseInt, constants.maxBreakTime)
  .option('-s, --session <n>', `the max number of sessions for long-term break`, parseInt, constants.maxSession)
  // .option('-d, --dtype <dtype>', 'select display type (big, small) for time format', /^(big|small)$/i, constants.timeDisplayType)
  .on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log(`  $ ${constants.programName} -h`)
    console.log(`  $ ${constants.programName} -t 25 -b 5`)
  })
  .parse(process.argv)

const userConfig = {}
userConfig.maxCountTime = commander.time || constants.maxCountTime
userConfig.maxBreakTime = commander.break || constants.maxBreakTime
userConfig.maxSession = commander.session || constants.maxSession
// userConfig.timeDisplayType = commander.dtype || constants.dtype

console.log('userConfig', userConfig)
const timerPomodoro = new TimerPomodoro(userConfig).run()

process.on('SIGINT', () => {
  console.info('\nSIGTERM signal received.')
  console.log('Terminating timer.')
  timerPomodoro.killRunningTimer()
})

