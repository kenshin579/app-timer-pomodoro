import TimerPomodoro from '../src/TimerPomodoro'
import constants from '../src/constants'
import fileUtils from '../src/FileUtils'

describe('Timer Pomodoro', () => {
  describe('Test Pomodoro', () => {
    it('test copy sound files', () => {
      // const timerPomodoro = new TimerPomodoro({defaultConfig.minuteStrFormat,  defaultConfig.maxCountTime})
    })
  })

  describe('Test FileUtil', () => {
    it('test copy sound files', () => {
      fileUtils.copyFilesInSrcDirToDstDir('./sound', constants.userHomeLibrarySoundPath)
    })
  })
})
