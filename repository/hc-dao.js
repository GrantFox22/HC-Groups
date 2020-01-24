require('dotenv').config({ path: '../.env' })
const queries = require('./hc-dao-queries')
const leader = require('../domain/leader')
const member = require('../domain/member')
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
        console.log('Error in hc-dao.getLeader: ' + error)
        resolve(buildLeader(null))
      } else {
        resolve(buildLeader(results))
      }
    })
  })
}

function getSmallGroupMembers (groupId) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.getSmallGroupMembers, [groupId], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.getSmallGroupMembers: ' + error)
        resolve(buildMembers(null))
      } else {
        resolve(buildMembers(results))
      }
    })
  })
}

function addAttendanceRecord (groupId, firstName, lastName, meetingDate, groupName) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.addAttendanceRecord, [groupId, firstName, lastName, meetingDate, groupName], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.addAttendanceRecord: ' + error)
        resolve(-1)
      } else {
        resolve(results.rowCount)
      }
    })
  })
}

function addGuestAttendanceRecord (guestFirstName, guestLastName, groupId, meetingDate) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.addGuestAttendanceRecord, [guestFirstName, guestLastName, groupId, meetingDate], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.addGuestAttendanceRecord: ' + error)
        resolve(-1)
      } else {
        resolve(results.rowCount)
      }
    })
  })
}

function registerLeader (token, userId) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.registerLeader, [token, new Date(), userId], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.registerLeader: ' + error)
        resolve(-1)
      }
      resolve(results.rowCount)
    })
  })
}

function buildLeader (results) {
  const smallGroupLeader = new leader.SmallGroupLeader()

  if (results === null) {
    return smallGroupLeader
  } else {
    smallGroupLeader.leaderFirstName = results.rows[0].leader_first_name
    smallGroupLeader.leaderLastName = results.rows[0].leader_last_name
    smallGroupLeader.leaderUserId = results.rows[0].leader_user_id
    smallGroupLeader.leaderToken = results.rows[0].leader_token
    smallGroupLeader.leaderType = results.rows[0].leader_type
    smallGroupLeader.createdDate = results.rows[0].created_date
    smallGroupLeader.lastUpdated = results.rows[0].last_updated
    smallGroupLeader.groupId = results.rows[0].group_id
    smallGroupLeader.groupName = results.rows[0].group_name
  }

  return smallGroupLeader
}

function buildMembers (results) {
  const members = []

  if (results === null) {
    return []
  } else {
    for (const row of results.rows) {
      const smallGroupMember = new member.SmallGroupMember()
      smallGroupMember.memberName = row.member_name
      members.push(smallGroupMember)
    }
  }

  return members
}

module.exports = {
  getLeader,
  getSmallGroupMembers,
  addAttendanceRecord,
  addGuestAttendanceRecord,
  registerLeader
}
