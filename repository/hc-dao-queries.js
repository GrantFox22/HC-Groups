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
  'group_id = $1;'
const getStaffMemberDetails = 'SELECT DISTINCT\n' +
  'fl_dev.fl_lead_staff.account_number "account_number",\n' +
  'COALESCE(fl_dev.fl_lead_staff.account_name, \'\') "name",\n' +
  'fl_dev.fl_lead_staff.email_address "email",\n' +
  'fl_dev.fl_lead_staff.record_status "status",\n' +
  'fl_dev.fl_lead_staff_type.description "staff_type",\n' +
  'fl_dev.fl_lead_staff.number_leads_allowed "leads_allowed",\n' +
  '(SELECT count(*) FROM fl_dev.fl_lead JOIN fl_dev.fl_lead_batch ON fl_dev.fl_lead_batch.lead_batch_id = fl_dev.fl_lead.lead_batch_id WHERE fl_dev.fl_lead_batch.account_number = fl_dev.fl_lead_staff.account_number AND fl_dev.fl_lead.record_status = \'A\' AND fl_dev.fl_lead.date_completed IS NULL AND fl_dev.fl_lead_batch.record_status = \'A\') "leads_assigned",\n' +
  '(SELECT count(*) FROM fl_dev.fl_lead JOIN fl_dev.fl_lead_batch ON fl_dev.fl_lead_batch.lead_batch_id = fl_dev.fl_lead.lead_batch_id WHERE fl_dev.fl_lead_batch.account_number = fl_dev.fl_lead_staff.account_number AND fl_dev.fl_lead.record_status = \'A\' AND fl_dev.fl_lead.lead_decision_id = 3) "futures"\n' +
  'FROM\n' +
  'fl_dev.fl_lead_staff\n' +
  'JOIN fl_dev.fl_lead_staff_type ON fl_dev.fl_lead_staff_type.lead_staff_type_id = fl_dev.fl_lead_staff.lead_staff_type_id\n' +
  'WHERE\n' +
  'fl_dev.fl_lead_staff.account_number = $1'
const registerLeader = 'update dev.leaders set leader_token = $1, last_updated = $2 where leader_user_id = $3'
const addAttendanceRecord = 'insert into dev.attendance \n' +
  '(group_id, attendee_first_name, attendee_last_name, meeting_date, group_name) \n' +
  'values ($1, $2, $3, $4, $5);'

module.exports = {
  getLeader,
  getSmallGroupMembers,
  registerLeader,
  addAttendanceRecord
}
