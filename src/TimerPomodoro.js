import constants from './constants'

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

//notify updates
pkgUpdateNotifier.notify()

class TimerPomodoro {
  constructor (userConfig = {}) {
    // const minuteStrFormat = '{0}:00'
    const minuteStrFormat = '00:05'
    this._maxSession = userConfig.maxSession

    this.currentTimer = new Timr(format(minuteStrFormat, userConfig.maxCountTime))

    const completedSession = localStorage.get('completedSession')
    if (completedSession >= userConfig.maxSession) {
      localStorage.set('completedSession', 0, { overwrite: true })
    }

    localStorage.set('maxTotalSession', this._maxSession, { overwrite: true })
  }

  run () {
    const currentSession = localStorage.get('completedSession') + 1
    const sessionFormat = `${currentSession}/${this._maxSession}`

    this.currentTimer.start()

    this._displayTicking(sessionFormat)

    this.currentTimer.finish(() => {
      this._writeToSingleLine(`Countdown Finished ✔︎\n`)

      localStorage.set('completedSession', currentSession, { overwrite: true })

      notifier.notify({
        title: pkg.name,
        message: format(constants.MESSAGE.COUNTDOWN_TIME_FINISHED, this.currentTimer.getStartTime() / 60),
        icon: path.join(__dirname, '../images/pomodoro.png'),
        sound: fs.existsSync(os.homedir(), '/Library/Sounds/', constants.soundFilePath, '.mp3') ? constants.soundFilePath : 'Blow',
        wait: true //not working
      })
    })

    return {
      killRunningTimer: () => {
        this.currentTimer.stop()
      }
    }
  }

  _displayTicking (sessionFormat) {
    this.currentTimer.ticker(({ formattedTime, raw, percentDone }) => {
      this._writeToSingleLine(`🕐 ${formattedTime} [${percentDone}%] - ${sessionFormat}`)
    })
  }

  _writeToSingleLine (text) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(text)
  }

}

export default TimerPomodoro
