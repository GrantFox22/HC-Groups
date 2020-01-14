const commonUtil = require('../util/common-util')

function isValidLeader (leader) {
  return commonUtil.objectHasContents(leader) && commonUtil.objectHasContents(leader.leaderUserId)
}

function isValidMembers (members) {
  let validMembers = true

  for (const member of members) {
    if (!commonUtil.objectHasContents(member) || !commonUtil.objectHasContents(member.memberName)) {
      validMembers = false
      break
    }
  }

  return validMembers
}

module.exports = {
  isValidLeader,
  isValidMembers
}
