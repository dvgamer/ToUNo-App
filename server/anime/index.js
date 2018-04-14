const { dialog } = require('electron')
const ipc = require('electron').ipcMain
const path = require('path')
const { lstatSync, readdirSync, existsSync } = require('fs')
const { join } = require('path')

let iniMapFolder = folder => { desktop: `${folder}\\Desktop.ini`, image: `${folder}\\ANIME.jpg` }

module.exports = () => {
  ipc.on('DIALOG_OPEN_FOLDER', e => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, data => {
      let folder = (data || [])[0]
      if (folder) folder = { name: path.basename(folder), path: folder }
      e.sender.send('DIALOG_OPEN_FOLDER', folder)
    })
  })

  ipc.on('FOLDER_LIST_ANIME', async (e, source) => {

    const isDirectory = f => lstatSync(f).isDirectory()
    const getDirectories = f => readdirSync(f).map(n => join(f, n)).filter(isDirectory)


    let rootAnime = []
    for (let i = 0; i < source.length; i++) {
      let folder = source[i]
      if (!isDirectory(folder)) return

      let subfolder = getDirectories(folder)

    }


    e.sender.send('FOLDER_LIST_PROGRESS', {})
    // if (fs.existsSync(source) && fs.lstatSync(source).isDirectory()) {
    // let items = []
    // let totalTime = 0

    //   let all = fs.readdirSync(source).map(name => {
    //     return () => {
    //       let item = {
    //         saved: false,
    //         verify: true,
    //         prepare: false,
    //         anilist: 0,
    //         anime_id: null,
    //         name: name,
    //         path: `${source}\\${name}`,
    //         files: [],
    //         anime: []
    //       }

    //       let walker = walk.walk(item.path, {})
    //       let time = Math.floor(Date.now())
    //       let isAnime = false

    //       let ini = iniMapFolder(item.path)

    //       if (fs.existsSync(file.desktop)) {
    //         let config = getINI(file.desktop)
    //         if (config['App-ToUNo'].id) isAnime = true
    //       }

    //       if (isAnime) {
    //         // console.log('found anime')
    //         def.resolve()
    //       } else {
    //         walker.on('file', function (root, file, next) {
    //           let ignore = [ 'Desktop.ini', 'ANIME.jpg', 'ANIME.ico' ]
    //           if (ignore.indexOf(file.name) === -1) {
    //             let list = {
    //               uid: file.uid,
    //               name: file.name,
    //               size: file.size,
    //               ctime: file.ctime
    //             }
    //             item.files.push(list)
    //           }
    //           next()
    //         })

    //         // console.log(`Tasks-${item.name} Begin...`);
    //         walker.on('errors', function (root, nodeStatsArray, next) {
    //           // console.log(`error-${root}`);
    //           next()
    //         })

    //         walker.on('end', function () {
    //           let elapsed = Math.floor(Date.now()) - time
    //           totalTime += elapsed
    //           if (item.files.length > 0) {
    //             // index++
    //             items.push(item)
    //           }
    //           // console.log(`Tasks-${item.name} Successful (${(elapsed/1000).toFixed(2)}s`);
    //           def.resolve()
    //         })
    //       }
    //       return def.promise
    //     }
    //   })

    //   async.series(all).then(results => {
    //     console.log(`Total ${all.length} Tasks Successful (${(totalTime / 1000).toFixed(2)}s)`)
    //     e.sender.send('GET_LIST_ANIME', { found: items.length > 0, items: items })
    //   })
    // } else {
    //   e.sender.send('GET_LIST_ANIME', { found: false, items: [] })
    // }
  })

}
