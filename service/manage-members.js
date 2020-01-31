const commonUtil = require('../util/common-util')
const hcDao = require('../repository/hc-dao')

function selectOptionChangedOnly (requestBody) {
  return commonUtil.objectHasContents(requestBody) && commonUtil.objectHasContents(requestBody.selectedGroup) && (commonUtil.convertStringToBoolean(requestBody.saveButton) === false || !commonUtil.objectHasContents(requestBody.saveButton))
}

function saveChangesClicked (requestBody) {
  return commonUtil.objectHasContents(requestBody) && commonUtil.convertStringToBoolean(requestBody.saveButton) === true
}

function parseMemberInfo (memberInfo) {
  const members = memberInfo.split('#')
  return {
    index: Number(members[0]),
    id: members[1]
  }
}

async function saveMemberChanges (modifiedMembers, deletedMembers, newMemberFirstNames, newMemberLastNames, memberFirstNames, memberLastNames, selectedGroup) {
  const result = {
    success: false,
    error: null
  }
  const modifiedMembersInfo = []
  const deletedMembersInfo = []
  const modifiedMembersToUpdate = []
  const deletedMembersToRemove = []
  const addedMembers = []

  for (const member of modifiedMembers) {
    modifiedMembersInfo.push(parseMemberInfo(member))
  }

  for (const member of deletedMembers) {
    deletedMembersInfo.push(parseMemberInfo(member))
  }

  if (commonUtil.objectHasContents(newMemberFirstNames) && newMemberLastNames.length !== newMemberFirstNames.length) {
    result.error = 'NameMismatchError'
    return result
  }

  if (commonUtil.objectHasContents(memberFirstNames)) {
    for (let i = 0; i < memberFirstNames.length; i++) {
      for (let j = 0; j < modifiedMembersInfo.length; j++) {
        if (modifiedMembersInfo[j].index === i) {
          modifiedMembersToUpdate.push({
            firstName: memberFirstNames[i],
            lastName: memberLastNames[i],
            id: modifiedMembersInfo[j].id
          })
        }
      }
    }

    for (let i = 0; i < memberFirstNames.length; i++) {
      for (let j = 0; j < deletedMembersInfo.length; j++) {
        if (deletedMembersInfo[j].index === i) {
          deletedMembersToRemove.push({
            firstName: memberFirstNames[i],
            lastName: memberLastNames[i],
            id: deletedMembersInfo[j].id
          })
        }
      }
    }
  }

  if (commonUtil.objectHasContents(newMemberFirstNames)) {
    for (let i = 0; i < newMemberFirstNames.length; i++) {
      addedMembers.push({
        firstName: newMemberFirstNames[i],
        lastName: newMemberLastNames[i],
        groupId: selectedGroup
      })
    }
  }

  for (const member of modifiedMembersToUpdate) {
    const rowsAffected = await hcDao.updateMember(member.firstName, member.lastName, member.id)
    if (rowsAffected < 1) {
      result.error = 'UpdateMemberError'
      return result
    }
  }

  for (const member of deletedMembersToRemove) {
    const rowsAffected = await hcDao.deleteMember(member.firstName, member.lastName, member.id)
    if (rowsAffected < 1) {
      result.error = 'DeleteMemberError'
      return result
    }
  }

  for (const member of addedMembers) {
    const rowsAffected = await hcDao.addMember(member.firstName, member.lastName, member.groupId)
    if (rowsAffected < 1) {
      result.error = 'InsertMemberError'
      return result
    }
  }

  result.success = true
  return result
}

module.exports = {
  selectOptionChangedOnly,
  saveChangesClicked,
  parseMemberInfo,
  saveMemberChanges
}
