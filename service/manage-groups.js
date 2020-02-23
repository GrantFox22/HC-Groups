const commonUtil = require('../util/common-util')
const hcDao = require('../repository/hc-dao')

function saveChangesClicked (requestBody) {
  return commonUtil.objectHasContents(requestBody) && commonUtil.convertStringToBoolean(requestBody.saveButton) === true
}

async function saveGroupChanges (modifiedGroups, deletedGroups, newGroups, groupNames) {
  const result = {
    success: false,
    error: null
  }
  const modifiedGroupsInfo = []
  const deletedGroupsToRemove = []

  for (const group of modifiedGroups) {
    modifiedGroupsInfo.push(parseModifiedGroupInfo(group))
  }

  for (const group of deletedGroups) {
    deletedGroupsToRemove.push(parseGroupInfo(group))
  }

  const modifiedMembersToUpdate = getModifiedGroups(groupNames, modifiedGroupsInfo)
  for (const group of modifiedMembersToUpdate) {
    const rowsAffected = await hcDao.updateGroup(group.groupName, group.groupId)
    if (rowsAffected < 1) {
      result.error = 'UpdateGroupError'
      return result
    }
  }

  for (const group of deletedGroupsToRemove) {
    const rowsAffected = await hcDao.deleteGroup(group.groupId)
    if (rowsAffected < 1) {
      result.error = 'DeleteGroupError'
      return result
    }
  }

  for (const groupName of newGroups) {
    const rowsAffected = await hcDao.addGroup(groupName)
    if (rowsAffected < 1) {
      result.error = 'InsertGroupError'
      return result
    }
  }

  result.success = true
  return result
}

function parseGroupInfo (groupInfo) {
  const group = groupInfo.split('#')
  return {
    groupId: Number(group[0]),
    groupName: group[1]
  }
}

function parseModifiedGroupInfo (groupInfo) {
  const groups = groupInfo.split('#')
  return {
    index: Number(groups[0]),
    id: groups[1]
  }
}

function getModifiedGroups (groupNames, modifiedGroupInfo) {
  const modifiedGroupsToUpdate = []

  if (commonUtil.objectHasContents(groupNames)) {
    for (let i = 0; i < groupNames.length; i++) {
      for (let j = 0; j < modifiedGroupInfo.length; j++) {
        if (modifiedGroupInfo[j].index === i) {
          modifiedGroupsToUpdate.push({
            groupName: groupNames[i],
            groupId: modifiedGroupInfo[j].id
          })
        }
      }
    }
  }

  return modifiedGroupsToUpdate
}

module.exports = {
  saveChangesClicked,
  saveGroupChanges
}
