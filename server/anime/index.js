const { dialog } = require('electron')
const ipc = require('electron').ipcMain
const path = require('path')
const { initDirectory, initAnime } = require('../walk')

// const attrib = 'c:/windows/system32/attrib.exe'
// const unlock = file => new Promise((resolve, reject) => {
//   exec(attrib, [ '-s', '-h', file ], error => {
//     if (error) reject(error); else resolve()
//   })
// })
// const lock = file => new Promise((resolve, reject) => {
//   exec(attrib, [ '+s', '+h', file ], error => {
//     if (error) reject(error); else resolve()
//   })
// })


// const updateDesktopINI = item => {
//   const setINI = (file, content) => {
//     let data = new Buffer(stringify(content).replace(/\[\\\./ig, '[.'))

//     try {
//       if (!fs.existsSync(file)) {
//         fs.writeFileSync(file, data)
//         return attrib('+', file)
//       } else {
//         return attrib('-', file).then(() => {
//           fs.writeFileSync(file, data)
//           return attrib('+', file)
//         })
//       }
//     } catch (e) {
//       console.log('setINI', file, e)
//       return {}
//     }
//   }
//   return () => {
//     let file = getFile(item.path)

//     item.anime.sound = item.anime.sound.join(',')
//     item.anime.subtitle = item.anime.subtitle.join(',')
//     let iniDesktop = {
//       '.ShellClassInfo': {
//         ConfirmFileOp: 0,
//         NoSharing: 1,
//         IconFile: 'ANIME.ico',
//         IconIndex: 0,
//         InfoTip: item.folder_name
//       },
//       'ViewState': {
//         Mode: 4,
//         Vid: '{137E7700-3573-11CF-AE69-08002B2E1262}',
//         FolderType: 'Videos',
//         Logo: 'ANIME.jpg'
//       },
//       'App-ToUNo': {
//         id: item.id,
//         english: item.english,
//         romaji: item.romaji,
//         status: item.status,
//         image: item.image
//       },
//       'Anime': item.anime
//     }
//     return setINI(file.desktop, iniDesktop)
//   }
// }


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
    let reportProgress = data => e.sender.send('FOLDER_LIST_PROGRESS', data)
    console.log('FOLDER_LIST_ANIME:', `Loaded: ${source.length} folders`)
    reportProgress({ status: '', step: 0, min: 0, max: source.length })
    let listFolder = []
    let maxFolder = 0
    if (source.length > 0) {
      for (let i = 0; i < source.length; i++) {
        let { folder, name } = source[i]
        reportProgress({ pretext: `Initialize Directory '${name}'...`, step: 1, min: i + 1 })
        source[i].subfolder = await initDirectory(folder, reportProgress)
        maxFolder += source[i].subfolder.length
      }
      console.log('FOLDER_LIST_ANIME:', `Total: ${maxFolder} folders`)
      reportProgress({ status: '', step: 2, min: 0, max: maxFolder })
   
      let index = 1
      for (let i = 0; i < source.length; i++) {
        let { subfolder, name } = source[i]
        reportProgress({ pretext: `Initialize Anime '${name}'...` })
        for (let l = 0; l < subfolder.length; l++) {
          reportProgress({ min: index })
          let anime = await initAnime(subfolder[l], reportProgress)
          if (anime) {
            console.log('FOLDER_LIST_ANIME:', `Anime: ${anime.name}`)
            listFolder.push(anime)
          }
          index++
        }
      }
      reportProgress({ pretext: '' })
    }
    e.sender.send('FOLDER_LIST_ANIME', listFolder)

    //       let ini = iniMapFolder(item.path)

    //       if (fs.existsSync(file.desktop)) {
    //         let config = getINI(file.desktop)
    //         if (config['App-ToUNo'].id) isAnime = true
    //       }



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
