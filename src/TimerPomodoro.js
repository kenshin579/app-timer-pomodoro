import { defaultConfig, RUNNING_MODE } from './constants'

const path = require('path')
const fs = require('fs')
const os = require('os')

const Timr = require('timrjs')
const notifier = require('node-notifier')
const updateNotifier = require('update-notifier')
const format = require('string-template')
const pkg = require('../package.json')

const getStorePath = () => path.join(require('os').homedir(), '.pomodoro_timer.json')
const localStorage = require('piggy-bank')(getStorePath())
const pkgUpdateNotifier = updateNotifier({ pkg })

// notify updates
pkgUpdateNotifier.notify()

class TimerPomodoro {
  constructor (userConfig = {}) {
    this._maxCountTime = userConfig.maxCountTime
    this._maxSession = userConfig.maxSession
    this._maxBreakTime = userConfig.maxBreakTime
    this._maxSession = userConfig.maxSession
    this._runningMode = userConfig.runningMode
    this.currentTimer = new Timr(format(defaultConfig.minuteStrFormat, this._maxCountTime))
  }

  run () {
    // set pomodoro setting
    this._setPomodoroSetting(this._maxBreakTime, this._maxSession, this._runningMode)

    const currentSession = localStorage.get('completedSession') + 1
    const completedBreakSession = localStorage.get('completedBreakSession')
    const sessionFormat = `Session ${currentSession} / ${this._maxSession}`

    let self = this
    // start pomodoro timer
    if (this._runningMode === RUNNING_MODE.COUNTDOWN_BREAK_TIME ||
      this._runningMode === RUNNING_MODE.COUNTDOWN_TIME) {
      this.currentTimer.start()

      this._displayTicking(this.currentTimer, sessionFormat)

      this.currentTimer.finish(() => {
        this._writeToSingleLine(`Countdown Finished ✔︎`)

        localStorage.set('completedSession', currentSession, { overwrite: true })

        notifier.notify({
          title: pkg.name,
          message: format(defaultConfig.MESSAGE.COUNTDOWN_TIME_FINISHED, this._maxCountTime),
          icon: path.join(__dirname, '../images/pomodoro.png'),
          sound: fs.existsSync(os.homedir(), '/Library/Sounds/', defaultConfig.soundFilePath, '.mp3') ? defaultConfig.soundFilePath : 'Blow',
          wait: true // not working
        },
        function () {
          if (self._runningMode === RUNNING_MODE.COUNTDOWN_BREAK_TIME) {
            self._breakTimer(self.currentTimer, completedBreakSession)
          }
        }
        )
      })
    }

    if (this._runningMode === RUNNING_MODE.BREAK_TIME) {
      this.currentTimer = this._breakTimer(this.currentTimer, completedBreakSession)
    }

    return {
      killRunningTimer: () => {
        this.currentTimer.stop()
      }
    }
  }

  _breakTimer (currentTimer, completedBreakSession) {
    currentTimer = new Timr(format(defaultConfig.minuteStrFormat, this._maxBreakTime))
    currentTimer.start()

    this._displayTicking(currentTimer)

    currentTimer.finish(() => {
      this._writeToSingleLine(`Break Time Finished ✔︎`)
      localStorage.set('completedBreakSession', completedBreakSession + 1, { overwrite: true })

      notifier.notify({
        title: pkg.name,
        message: format(defaultConfig.MESSAGE.BREAK_TIME_FINISHED, this._maxBreakTime),
        icon: path.join(__dirname, `../images/break${completedBreakSession}.png`),
        sound: fs.existsSync(os.homedir(), '/Library/Sounds/', defaultConfig.soundFilePath, '.mp3') ? defaultConfig.soundFilePath : 'Blow',
        wait: true // not working
      })
    })

    return currentTimer
  }

  _setPomodoroSetting (maxBreakTime, maxSession, runningMode) {
    let completedSession = localStorage.get('completedSession')
    let completedBreakSession = localStorage.get('completedBreakSession')
    let longTermBreak = localStorage.get('longTermBreak')

    // init
    if (completedSession === undefined) {
      completedSession = 0
      localStorage.set('completedSession', completedSession, { overwrite: true })
    }
    if (completedBreakSession === undefined) {
      completedBreakSession = 0
      localStorage.set('completedBreakSession', completedBreakSession, { overwrite: true })
    }
    if (longTermBreak === undefined || longTermBreak) {
      longTermBreak = false
      localStorage.set('longTermBreak', longTermBreak, { overwrite: true })
      localStorage.set('completedBreakSession', 0, { overwrite: true })
    }

    localStorage.set('maxTotalSession', this._maxSession, { overwrite: true })

    // i think i need unit test for this (a little bit confused myself)
    if (runningMode === RUNNING_MODE.BREAK_TIME &&
      !longTermBreak &&
      completedBreakSession >= maxSession) {
      if (maxBreakTime >= defaultConfig.maxLongTermBreakTime) {
        localStorage.set('longTermBreak', true, { overwrite: true })
        localStorage.set('completedSession', 0, { overwrite: true })
        localStorage.set('completedBreakSession', 0, { overwrite: true })
      }
      if (completedSession >= maxSession && maxBreakTime < defaultConfig.maxLongTermBreakTime) {
        console.log(format(defaultConfig.MESSAGE.EXCEEDED_MAX_SESSION, maxSession, defaultConfig.maxLongTermBreakTime))
        process.exit()
      }
    } else {
      if (completedSession >= maxSession && maxBreakTime < defaultConfig.maxLongTermBreakTime) {
        console.log(format(defaultConfig.MESSAGE.EXCEEDED_MAX_SESSION, maxSession, defaultConfig.maxLongTermBreakTime))
        process.exit()
      } else if (completedBreakSession >= completedSession && runningMode === RUNNING_MODE.BREAK_TIME) {
        console.log(defaultConfig.MESSAGE.EXCEEDED_BREAK_SESSION)
        process.exit()
      } else if (completedBreakSession < completedSession &&
        (runningMode === RUNNING_MODE.COUNTDOWN_BREAK_TIME ||
          runningMode === RUNNING_MODE.COUNTDOWN_TIME)) {
        console.log(format(defaultConfig.MESSAGE.EXCEEDED_COUNTDOWN_SESSION, defaultConfig.maxBreakTime))
        process.exit()
      }
    }
  }

  _displayTicking (currentTimer, sessionFormat) {
    currentTimer.ticker(({ formattedTime, raw, percentDone }) => {
      if (sessionFormat) {
        this._writeToSingleLine(`🕐 ${formattedTime} [${percentDone}%] - ${sessionFormat}`)
      } else {
        this._writeToSingleLine(`🕐 ${formattedTime} [${percentDone}%]`)
      }
    })
  }

  _writeToSingleLine (text) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(text)
  }
}

export default TimerPomodoro
