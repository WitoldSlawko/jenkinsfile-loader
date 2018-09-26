const fs = require('fs-promise');
const axios = require('axios')
const log = require('./logger.js')

const JENKINS_URL = 'http://localhost:8080'
const jenkins = axios.create({
  baseURL: JENKINS_URL,
  timeout: 10000,
})
const configFile = '/home/andrzej.rehmann/projects/hoto/rapid-jenkinsfile-loader/test/resources/config.xml'
const jobName = 'my-new-job';

function ifJobExist(response) {
  return false;
}

fs
  .readFile(configFile)
  .then(newConfig =>
    checkIfJobExists({jobName})
      .then(response => {
        ifJobExist(response) ?
          updateJob({jobName, config: newConfig.toString()}) :
          createJob({jobName, config: newConfig.toString()})
      })
  )
  .catch(log.error)

function checkIfJobExists({jobName}) {
  log.info(`Checking if job ${jobName} exists...`)
  jenkins.get(`http://localhost:8080//api/json?tree=jobs[name]`)

}

function updateJob({jobName, config}) {
  log.info(`Updating job ${jobName}...`)
  return jenkins({
    method: 'POST',
    headers: {'content-type': 'text/xml'},
    data: config,
    url: `/job/${jobName}/config.xml`
  })
}

function createJob({jobName, config}) {
  log.info(`Creating new job ${jobName}...`)
  return jenkins({
    method: 'POST',
    headers: {'content-type': 'text/xml'},
    data: config,
    url: `/createItem?name=${jobName}`
  })
}
