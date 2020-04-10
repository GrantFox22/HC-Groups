const lodash = require('lodash')
const commonUtil = require('../util/common-util')
const hcDao = require('../repository/hc-dao')

function saveChangesClicked (requestBody) {
  return commonUtil.objectHasContents(requestBody) && commonUtil.convertStringToBoolean(requestBody.saveButton) === true
}

async function saveLeaderChanges (leaderData) {
  const result = {
    success: false,
    error: null
  }
  const modifiedLeadersInfo = []
  const modifiedLeadersTypeInfo = []
  const modifiedLeadersGroupInfo = []
  const deletedLeadersToRemove = []

  for (const leader of leaderData.modifiedLeaders) {
    modifiedLeadersInfo.push(parseModifiedLeaderInfo(leader))
  }

  for (const leader of leaderData.deletedLeaders) {
    deletedLeadersToRemove.push(parseModifiedLeaderInfo(leader))
  }

  for (const leader of leaderData.leaderType) {
    modifiedLeadersTypeInfo.push(parseLeaderTypeInfo(leader))
  }

  for (const leader of leaderData.assignedGroup) {
    modifiedLeadersGroupInfo.push(parseLeaderGroupInfo(leader))
  }

  const modifiedLeadersToUpdate = getModifiedLeaders(leaderData, modifiedLeadersInfo, modifiedLeadersTypeInfo, modifiedLeadersGroupInfo)
  for (const leader of modifiedLeadersToUpdate) {
    const rowsAffected = await hcDao.updateLeader(leader)
    if (rowsAffected < 1) {
      result.error = 'UpdateLeaderError'
      return result
    }
  }

  for (const leader of deletedLeadersToRemove) {
    const rowsAffected = await hcDao.deleteLeader(leader.id)
    if (rowsAffected < 1) {
      result.error = 'DeleteLeaderError'
      return result
    }
  }

  const newLeaders = getNewLeaders(leaderData)
  for (const newLeader of newLeaders) {
    const rowsAffected = await hcDao.addLeader(newLeader)
    if (rowsAffected < 1) {
      result.error = 'InsertLeaderError'
      return result
    }
  }

  result.success = true
  return result
}

function parseLeaderGroupInfo (leaderInfo) {
  const leader = leaderInfo.split('#')
  return {
    groupId: Number(leader[0]),
    leaderId: Number(leader[1])
  }
}

function parseLeaderTypeInfo (leaderInfo) {
  const leader = leaderInfo.split('#')
  return {
    leaderTypeId: Number(leader[0]),
    leaderId: Number(leader[1])
  }
}

function parseModifiedLeaderInfo (leaderInfo) {
  const leader = leaderInfo.split('#')
  return {
    index: Number(leader[0]),
    id: leader[1]
  }
}

function getModifiedLeaders (leaderData, modifiedLeadersInfo, modifiedLeadersTypeInfo, modifiedLeadersGroupInfo) {
  const modifiedLeadersToUpdate = []

  if (commonUtil.objectHasContents(leaderData.leaderFirstName)) {
    for (let i = 0; i < leaderData.leaderFirstName.length; i++) {
      for (let j = 0; j < modifiedLeadersInfo.length; j++) {
        if (modifiedLeadersInfo[j].index === i) {
          const leaderTypeInfo = lodash.filter(modifiedLeadersTypeInfo, type => type.leaderId === Number(modifiedLeadersInfo[j].id))
          const leaderGroupInfo = lodash.filter(modifiedLeadersGroupInfo, group => group.leaderId === Number(modifiedLeadersInfo[j].id))
          modifiedLeadersToUpdate.push({
            leaderFirstName: leaderData.leaderFirstName[i],
            leaderLastName: leaderData.leaderLastName[i],
            leaderUserId: leaderData.leaderUserId[i],
            leaderType: leaderTypeInfo[0].leaderTypeId,
            assignedGroup: leaderGroupInfo[0].groupId,
            leaderId: modifiedLeadersInfo[j].id
          })
        }
      }
    }
  }

  return modifiedLeadersToUpdate
}

function getNewLeaders (leaderData) {
  const newLeaders = []
  for (let i = 0; i < leaderData.newLeaderFirstName.length; i++) {
    newLeaders.push({
      firstName: leaderData.newLeaderFirstName[i],
      lastName: leaderData.newLeaderLastName[i],
      leaderUserId: leaderData.newLeaderUserId[i],
      leaderType: leaderData.newLeaderType[i],
      group: leaderData.newGroup[i]
    })
  }
  return newLeaders
}

module.exports = {
  saveChangesClicked,
  saveLeaderChanges
}
