const watcher = require('./watcher.js')
const config = require('./config.js')
const jenkins = require('./jenkins.js')

const startWatching = () =>
  watcher.watch({dir: config.jenkinsfilesDir})
    .on('add', jenkins.createJob)
    .on('change', jenkins.updateJob)
    .on('unlink', jenkins.deleteJob)

module.exports = {
  startWatching
}
