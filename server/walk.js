const walk = require('walk')
const ini = require('ini')
const { join, basename, extname } = require('path')
const { readFileSync } = require('fs')
const { parse } = require('ini')

const FOLDER_DEEP_MAX = 3
const ANIME_FILE_DESKTOP = 'Desktop.ini'
const ANIME_FILE_IMAGE = 'ANIME.jpg'

module.exports = {
  initDirectory: (folder, emit) => new Promise((resolve, reject) => {
    let walker = walk.walk(folder)
    let rootAnime = []
    walker.on('directory', (root, stats, next) => {
      let subfolder = join(root, stats.name)
      let ignore = [ 'System Volume Information', '$RECYCLE.BIN', '.git' ]
      if (ignore.indexOf(subfolder) === -1) {
        let sub = subfolder.replace(folder, '')
        let deep = subfolder.replace(folder, '').match(/\\|\//g) || ''
        emit({ status: `${sub.substring(0, 55)}${sub.length > 55 ? '...' : ''}` })
        if (deep.length <= FOLDER_DEEP_MAX) rootAnime.push(subfolder)
      }
      next()
    })

    walker.on('errors', (root, stats, next) => {
      console.error(stats)
      next()
    })

    walker.on('end', () => resolve(rootAnime))
  }),
  initAnime: (folder, emit) => new Promise((resolve, reject) => {
    let walker = walk.walk(folder)
    let filters = [ '.mp4','.mkv','.avi','.mpg','.mpeg','.flv','.wmv','.mov' ]

    console.log(folder)
    let anime = {
      ini: null,
      cover: null,
      anilist_id: null,
      name: basename(folder),
      foldername: basename(folder),
      data: {},
      path: folder,
      files: []
    }
    emit({ status: `${anime.name.substring(0, 55)}${anime.name.length > 55 ? '...' : ''}` })
    walker.on('file', (root, stats, next) => {
      if (root === folder) {
        if (stats.name.toLowerCase() === ANIME_FILE_DESKTOP.toLowerCase())  {
          anime.ini = `${folder}/${ANIME_FILE_DESKTOP}`
          anime.data = parse(readFileSync(anime.ini, 'utf-8'))
          if (config['aniStorage'].id) anime.anilist_id = config['aniStorage'].id
        }
        if (stats.name.toLowerCase() === ANIME_FILE_IMAGE.toLowerCase()) {
          anime.cover = `${folder}/${ANIME_FILE_IMAGE}`
        }

        if (filters.indexOf(extname(stats.name.toLowerCase())) > -1) {
          anime.files.push({
            uid: stats.uid,
            name: stats.name,
            size: stats.size,
            ctime: stats.ctime
          })
        }
      }
      next()
    })
    walker.on('end', () => resolve(anime.files.length > 0 ? anime : null))
  })
}
