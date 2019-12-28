const getLeader = 'SELECT\n' +
  'leader_first_name,\n' +
  'leader_last_name,\n' +
  'leader_user_id,\n' +
  'leader_token,\n' +
  'leader_type,\n' +
  'created_date,\n' +
  'last_updated\n' +
  'FROM\n' +
  'dev.leaders\n' +
  'WHERE\n' +
  'leader_user_id = $1\n' +
  'LIMIT 1;'
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
const saveUser = 'insert into fl_dev.fl_lead_staff \n' +
  '(lead_staff_type_id, number_leads_allowed, create_datetime, create_userid, last_update_datetime, last_update_userid, record_status, email_address, account_name, user_token) \n' +
  'values \n' +
  '()'

module.exports = {
  getLeader,
  getStaffMemberDetails,
  registerLeader,
  saveUser
}
