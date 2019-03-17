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

    const currentSession = localStorage.get('completedSession')
    const completedBreakSession = localStorage.get('completedBreakSession')
    const sessionFormat = `Session ${currentSession} / ${this._maxSession}`

    // start pomodoro timer
    if (this._runningMode === RUNNING_MODE.COUNTDOWN_BREAK_TIME ||
      this._runningMode === RUNNING_MODE.COUNTDOWN_TIME) {
      this.currentTimer.start()

      this._displayTicking(this.currentTimer, sessionFormat)

      this.currentTimer.finish(() => {
        let self = this
        this._writeToSingleLine(`Countdown Finished ✔︎\n`)

        localStorage.set('completedSession', currentSession + 1, { overwrite: true })

        notifier.notify({
            title: pkg.name,
            message: format(defaultConfig.MESSAGE.COUNTDOWN_TIME_FINISHED, this.currentTimer.getStartTime() / 60),
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
      this._breakTimer(this.currentTimer, completedBreakSession)
    }

    return {
      killRunningTimer: () => {
        this.currentTimer.stop()
      }
    }
  }

  _breakTimer (currentTimer, completedBreakSession) {
    console.log('completedBreakSession', completedBreakSession)
    currentTimer = new Timr(format(defaultConfig.minuteStrFormat, this._maxBreakTime))
    currentTimer.start()

    this._displayTicking(currentTimer)

    currentTimer.finish(() => {
      this._writeToSingleLine(`Break Time Finished ✔︎\n`)
      localStorage.set('completedBreakSession', completedBreakSession + 1, { overwrite: true })

      notifier.notify({
        title: pkg.name,
        message: format(defaultConfig.MESSAGE.BREAK_TIME_FINISHED, this._maxBreakTime / 60),
        icon: path.join(__dirname, `../images/break${completedBreakSession}.png`),
        sound: fs.existsSync(os.homedir(), '/Library/Sounds/', defaultConfig.soundFilePath, '.mp3') ? defaultConfig.soundFilePath : 'Blow',
        wait: true // not working
      })
    })
  }

  _setPomodoroSetting (maxBreakTime, maxSession, runningMode) {
    let completedSession = localStorage.get('completedSession')
    let completedBreakSession = localStorage.get('completedBreakSession')
    let longTermBreak = localStorage.get('longTermBreak')

    // init
    if (completedSession === null) {
      completedSession = 0
      localStorage.set('completedSession', completedSession, { overwrite: true })
    }
    if (completedBreakSession === null) {
      completedBreakSession = 0
      localStorage.set('completedBreakSession', completedBreakSession, { overwrite: true })
    }
    if (longTermBreak === null || longTermBreak) {
      longTermBreak = false
      localStorage.set('longTermBreak', longTermBreak, { overwrite: true })
      localStorage.set('completedBreakSession', 0, { overwrite: true })
    }

    localStorage.set('maxTotalSession', this._maxSession, { overwrite: true })

    // need longterm break
    if (completedBreakSession > completedSession && runningMode === RUNNING_MODE.BREAK_TIME) {
      console.log(defaultConfig.MESSAGE.EXCEEDED_BREAK_SESSION)
      process.exit()
    }

    if (runningMode === RUNNING_MODE.BREAK_TIME &&
      !longTermBreak &&
      completedBreakSession >= maxSession) {
      if (maxBreakTime >= defaultConfig.maxLongTermBreakTime) {
        console.log('reset')
        localStorage.set('longTermBreak', true, { overwrite: true })
        localStorage.set('completedSession', 0, { overwrite: true })
        localStorage.set('completedBreakSession', 0, { overwrite: true })
      }
    }

    if (completedSession >= maxSession && maxBreakTime < defaultConfig.maxLongTermBreakTime) {
      console.log(format(defaultConfig.MESSAGE.EXCEEDED_MAX_SESSION, maxSession, defaultConfig.maxLongTermBreakTime))
      process.exit()
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
