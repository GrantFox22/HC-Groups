require('dotenv').config()
const debug = require('../config/debug')('app:support-leads-dao')
const queries = require('./hc-dao-queries')
const leader = require('../domain/leader')
const commonUtil = require('../util/common-util')
const { Pool } = require('pg')

function connectToPostgres () {
  return new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  })
}

function getLeader (userId) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.getLeader, [userId], async (error, results) => {
      await postgres.end()
      if (error) {
        debug('Error in hc-dao.getLeader: %O', error)
        resolve(buildLeader(setResponse(null, error)))
      } else {
        resolve(buildLeader(setResponse(results, null)))
      }
    })
  })
}

function registerLeader (token, userId) {
  const postgres = connectToPostgres()
  const updatedDate = new Date()

  return new Promise((resolve) => {
    postgres.query(queries.registerLeader, [token, updatedDate, userId], async (error, results) => {
      await postgres.end()
      if (error) {
        debug('Error in hc-dao.registerLeader: %O', error)
        resolve(-1)
      }
      resolve(results.rowCount)
    })
  })
}

function setResponse (results, error) {
  return {
    results: results,
    error: error
  }
}

function buildLeader (response) {
  const smallGroupLeader = new leader.SmallGroupLeader()

  if (commonUtil.objectHasContents(response.error)) {
    return smallGroupLeader
  } else {
    smallGroupLeader.leaderFirstName = response.results.rows[0].leader_first_name
    smallGroupLeader.leaderLastName = response.results.rows[0].leader_last_name
    smallGroupLeader.leaderUserId = response.results.rows[0].leader_user_id
    smallGroupLeader.leaderToken = response.results.rows[0].leader_token
    smallGroupLeader.leaderType = response.results.rows[0].leader_type
    smallGroupLeader.createdDate = response.results.rows[0].created_date
    smallGroupLeader.lastUpdated = response.results.rows[0].last_updated
  }

  return smallGroupLeader
}

module.exports = {
  getLeader,
  registerLeader
}
