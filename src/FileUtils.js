import fs from 'fs'
import constants from './constants'

export default class FileUtils {
  static copyFilesInSrcDirToDstDir (srcDir, dstDir) {
    console.log('copying ', srcDir, 'to', dstDir)

    if (!fs.existsSync(constants.userHomeLibrarySoundPath)) {
      fs.mkdirSync(constants.userHomeLibrarySoundPath)
    }

    fs.readdirSync(srcDir).forEach(file => {
      let srcFile = srcDir + '/' + file
      fs.copyFile(srcFile, constants.userHomeLibrarySoundPath + '/' + file, (err => {
        if (err) throw err
        console.info('copying ', srcFile, 'sound file to', constants.userHomeLibrarySoundPath)
      }))
    })
  }
}
