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
const getLeaders = 'SELECT\n' +
  'dev.leaders.leader_id,\n' +
  'dev.leaders.leader_first_name,\n' +
  'dev.leaders.leader_last_name,\n' +
  'dev.leaders.leader_user_id,\n' +
  'dev.leaders.leader_token,\n' +
  'dev.leaders.leader_type,\n' +
  'dev.leader_types.type_name "leader_type_description",\n' +
  'dev.leaders.created_date,\n' +
  'dev.leaders.last_updated,\n' +
  'dev.leaders.group_id,\n' +
  'dev.groups.group_name\n' +
  'FROM\n' +
  'dev.leaders\n' +
  'JOIN dev.groups ON dev.groups.group_id = dev.leaders.group_id\n' +
  'JOIN dev.leader_types ON dev.leader_types.type_id = dev.leaders.leader_type\n' +
  'ORDER BY leader_id;'
const getSmallGroupMembers = 'SELECT\n' +
  'CONCAT(first_name, \' \', last_name) "member_name"\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'WHERE\n' +
  'group_id = $1\n' +
  'ORDER BY last_name, first_name;'
const getSmallGroupMembersForAdmin = 'SELECT\n' +
  'first_name, last_name, group_id, record_id\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'where group_id = $1\n' +
  'ORDER BY last_name, first_name;'
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
const updateGroup = 'update dev.groups set group_name = $1, added_date = current_timestamp where group_id = $2;'
const deleteGroup = 'delete from dev.groups where group_id = $1;'
const addGroup = 'insert into dev.groups (group_name, added_date) VALUES ($1, current_timestamp);'
const getMembersAttendanceReport = 'SELECT distinct\n' +
  'dev.group_members.first_name,\n' +
  'dev.group_members.last_name,\n' +
  'dev.attendance.meeting_date,\n' +
  '(SELECT COUNT(*) FROM (SELECT distinct dev.attendance.attendee_first_name, dev.attendance.attendee_last_name FROM dev.attendance WHERE dev.attendance.attendee_first_name = dev.group_members.first_name AND dev.attendance.attendee_last_name = dev.group_members.last_name AND dev.attendance.meeting_date in ($2, $3, $4)) a) "attended"\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'JOIN dev.attendance ON dev.attendance.group_id = dev.group_members.group_id\n' +
  'WHERE\n' +
  'dev.group_members.group_id = $1 and dev.attendance.meeting_date in ($2, $3, $4)\n' +
  'ORDER BY dev.group_members.last_name, dev.group_members.first_name;'
const getGuestsAttendanceReport = 'SELECT distinct\n' +
  'dev.guests.guest_first_name,\n' +
  'dev.guests.guest_last_name,\n' +
  'dev.guests.meeting_date,\n' +
  'dev.groups.group_name\n' +
  'FROM\n' +
  'dev.guests\n' +
  'JOIN dev.groups ON dev.groups.group_id = dev.guests.group_id\n' +
  'WHERE\n' +
  'dev.guests.group_id = $1 and dev.guests.meeting_date in ($2, $3, $4);'
const getAttendanceStatisticsReport = 'SELECT distinct\n' +
  'dev.attendance.group_name,\n' +
  '(SELECT COUNT(*) FROM dev.group_members where group_id = $1) "total_members",\n' +
  '(SELECT COUNT(*) FROM (select distinct dev.attendance.attendee_first_name, dev.attendance.attendee_last_name FROM dev.attendance where group_id = $1 and meeting_date in ($2, $3, $4)) tma)  "total_members_attended",\n' +
  '(SELECT round((SELECT COUNT(*) FROM (select distinct dev.attendance.attendee_first_name, dev.attendance.attendee_last_name FROM dev.attendance WHERE dev.attendance.group_id = $1 and dev.attendance.meeting_date in ($2, $3, $4)) tma) * 100::numeric / (SELECT COUNT(*) FROM dev.group_members WHERE dev.group_members.group_id = $1), 2)) "percent_attended"\n' +
  'FROM\n' +
  'dev.group_members\n' +
  'JOIN dev.attendance ON dev.attendance.group_id = dev.group_members.group_id\n' +
  'WHERE dev.attendance.group_id = $1 and dev.attendance.meeting_date in ($2, $3, $4);'
const getGroupMembersTotal = 'select count(distinct record_id) from dev.group_members where group_id = $1;'
const deleteLeader = 'delete from dev.leaders where leader_id = $1;'
const updateLeader = 'update dev.leaders set leader_first_name = $1, leader_last_name = $2, leader_user_id = $3, leader_type = $4, group_id = $5, last_updated = current_timestamp where leader_id = $6;'
const addLeader = 'insert into dev.leaders (leader_first_name, leader_last_name, leader_user_id, leader_type, created_date, last_updated, group_id)\n' +
  'values ($1, $2, $3, $4, current_timestamp, current_timestamp, $5);'
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
  getMembersAttendanceReport,
  getGuestsAttendanceReport,
  getAttendanceStatisticsReport,
  getGroupMembersTotal,
  updateGroup,
  deleteGroup,
  addGroup,
  getLeaders,
  deleteLeader,
  updateLeader,
  addLeader
}
