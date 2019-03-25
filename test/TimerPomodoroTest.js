import constants from '../src/constants'
import fileUtils from '../src/FileUtils'

describe('Timer Pomodoro', () => {
  describe('Test Pomodoro', () => {

  })

  describe('Test FileUtil', () => {
    it('test copy sound files', () => {
      fileUtils.copyFilesInSrcDirToDstDir('./sound', constants.userHomeLibrarySoundPath)
    })
  })
})
