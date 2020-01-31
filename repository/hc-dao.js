require('dotenv').config({ path: '../.env' })
const queries = require('./hc-dao-queries')
const leader = require('../domain/leader')
const member = require('../domain/member')
const group = require('../domain/group')
const hcMember = require('../domain/hc-group-member')
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

function getSmallGroupMembersForAdmin (groupId) {
  if (groupId === 'default') {
    return buildMembersForAdmin(null)
  }

  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.getSmallGroupMembersForAdmin, [groupId], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.getSmallGroupMembersForAdmin: ' + error)
        resolve(buildMembersForAdmin(null))
      } else {
        resolve(buildMembersForAdmin(results))
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

function updateMember (memberFirstName, memberLastName, id) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.updateMember, [memberFirstName, memberLastName, id], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.updateMember: ' + error)
        resolve(-1)
      } else {
        resolve(results.rowCount)
      }
    })
  })
}

function deleteMember (memberFirstName, memberLastName, id) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.deleteMember, [memberFirstName, memberLastName, id], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.deleteMember: ' + error)
        resolve(-1)
      } else {
        resolve(results.rowCount)
      }
    })
  })
}

function addMember (memberFirstName, memberLastName, groupId) {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.addMember, [memberFirstName, memberLastName, groupId], async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.addMember: ' + error)
        resolve(-1)
      } else {
        resolve(results.rowCount)
      }
    })
  })
}

function getSmallGroups () {
  const postgres = connectToPostgres()

  return new Promise((resolve) => {
    postgres.query(queries.getSmallGroups, async (error, results) => {
      await postgres.end()
      if (error) {
        console.log('Error in hc-dao.getSmallGroups: ' + error)
        resolve(buildSmallGroups(null))
      } else {
        resolve(buildSmallGroups(results))
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
    return members
  } else {
    for (const row of results.rows) {
      const smallGroupMember = new member.SmallGroupMember()
      smallGroupMember.memberName = row.member_name
      members.push(smallGroupMember)
    }
  }

  return members
}

function buildMembersForAdmin (results) {
  const members = []

  if (results === null) {
    return members
  } else {
    for (const row of results.rows) {
      const smallGroupMember = new hcMember.SmallGroupMember()
      smallGroupMember.firstName = row.first_name
      smallGroupMember.lastName = row.last_name
      smallGroupMember.groupId = row.group_id
      smallGroupMember.id = row.record_id
      members.push(smallGroupMember)
    }
  }

  return members
}

function buildSmallGroups (results) {
  const smallGroups = []

  if (results === null) {
    return smallGroups
  } else {
    for (const row of results.rows) {
      const smallGroup = new group.SmallGroup()
      smallGroup.groupName = row.group_name
      smallGroup.groupId = row.group_id
      smallGroups.push(smallGroup)
    }
  }

  return smallGroups
}

module.exports = {
  getLeader,
  getSmallGroupMembers,
  addAttendanceRecord,
  addGuestAttendanceRecord,
  getSmallGroups,
  getSmallGroupMembersForAdmin,
  registerLeader,
  updateMember,
  deleteMember,
  addMember
}
