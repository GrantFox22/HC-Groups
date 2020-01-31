const getLeader = 'SELECT\n' +
  'dev.leaders.leader_first_name,\n' +
  'dev.leaders.leader_last_name,\n' +
  'dev.leaders.leader_user_id,\n' +
  'dev.leaders.leader_token,\n' +
  'dev.leaders.leader_type,\n' +
  'dev.leaders.created_date,\n' +
  'dev.leaders.last_updated,\n' +
  'dev.leaders.group_id,\n' +
  'dev.groups.group_name\n' +
  'FROM\n' +
  'dev.leaders\n' +
  'JOIN dev.groups ON dev.groups.group_id = dev.leaders.group_id\n' +
  'WHERE\n' +
  'dev.leaders.leader_user_id = $1\n' +
  'LIMIT 1;'
const getSmallGroupMembers = 'SELECT\n' +
  'CONCAT(first_name, \' \', last_name) "member_name"\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'WHERE\n' +
  'group_id = $1\n' +
  'ORDER BY last_name;'
const getSmallGroupMembersForAdmin = 'SELECT\n' +
  'first_name, last_name, group_id, record_id\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'where group_id = $1\n' +
  'ORDER BY last_name;'
const registerLeader = 'update dev.leaders set leader_token = $1, last_updated = $2 where leader_user_id = $3'
const addAttendanceRecord = 'insert into dev.attendance \n' +
  '(group_id, attendee_first_name, attendee_last_name, meeting_date, group_name) \n' +
  'values ($1, $2, $3, $4, $5);'
const addGuestAttendanceRecord = 'insert into dev.guests \n' +
  '(guest_first_name, guest_last_name, group_id, meeting_date) \n' +
  'values ($1, $2, $3, $4);'
const getSmallGroups = 'select group_id, group_name from dev.groups;'
const updateMember = 'update dev.group_members set first_name = $1, last_name = $2 where record_id = $3'
const deleteMember = 'delete from dev.group_members where first_name = $1 and last_name = $2 and record_id = $3'
const addMember = 'insert into dev.group_members \n' +
  '(first_name, last_name, group_id) \n' +
  'values ($1, $2, $3);'
const getMembersAttendanceReportByGroupId = 'SELECT\n' +
  '  dev.group_members.first_name,\n' +
  '  dev.group_members.last_name,\n' +
  '  dev.attendance.meeting_date,\n' +
  '  (SELECT COUNT(*) FROM dev.attendance WHERE dev.attendance.attendee_first_name = dev.group_members.first_name AND dev.attendance.attendee_last_name = dev.group_members.last_name) "attended"\n' +
  '  FROM\n' +
  '  dev.group_members\n' +
  '  JOIN dev.attendance ON dev.attendance.group_id = dev.group_members.group_id\n' +
  '  WHERE\n' +
  '  dev.group_members.group_id = $1 and dev.attendance.meeting_date = $2;'

module.exports = {
  getLeader,
  getSmallGroupMembers,
  getSmallGroupMembersForAdmin,
  registerLeader,
  addAttendanceRecord,
  addGuestAttendanceRecord,
  getSmallGroups,
  updateMember,
  deleteMember,
  addMember,
  getMembersAttendanceReportByGroupId
}
