const hcDao = require('../repository/hc-dao')
const leaderHomeValidator = require('../validation/leader-home-validator')

async function loadLeaderHomePage (leader) {
  const members = await hcDao.getSmallGroupMembers(leader._groupId)
  let leaderHomeData = {
    members: null
  }
  if (leaderHomeValidator.isValidMembers(members)) {
    leaderHomeData.members = members
  }
  return leaderHomeData
}

function parseMemberName (memberName) {
  const memberNameArray = memberName.split(' ')
  return {
    firstName: memberNameArray[0],
    lastName: memberNameArray[1]
  }
}

module.exports = {
  loadLeaderHomePage,
  parseMemberName
}
