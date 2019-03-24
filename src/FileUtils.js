import fs from 'fs'
import constants from './constants'
import { getInstalledPathSync } from 'get-installed-path'
import path from 'path'

export default class FileUtils {
  static copyFilesInSrcDirToDstDir (srcDir, dstDir) {
    let rootPath = fs.existsSync(path.join(getInstalledPathSync(constants.programName), srcDir)) ? getInstalledPathSync(constants.programName) : ''
    srcDir = path.join(rootPath, srcDir)
    // console.info('srcDir', srcDir)

    if (!fs.existsSync(constants.userHomeLibrarySoundPath)) {
      fs.mkdirSync(constants.userHomeLibrarySoundPath)
    }

    if (fs.existsSync(srcDir)) {
      fs.readdirSync(srcDir).forEach(file => {
        let srcFile = srcDir + '/' + file
        fs.copyFile(srcFile, dstDir + '/' + file, (err => {
          if (err) throw err
          // console.info('copying ', srcFile, 'sound file to', dstDir)
        }))
      })
    }
  }
}
