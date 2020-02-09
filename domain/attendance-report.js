class SmallGroupAttendanceReport {
  constructor () {
    this._groupName = ''
    this._groupId = ''
    this._totalMembers = ''
    this._totalMembersAttended = ''
    this._percentAttended = ''
    this._memberFirstName = []
    this._memberLastName = []
    this._attended = []
    this._meetingDate = ''
    this._guestFirstName = []
    this._guestLastName = []
  }

  get totalMembers () {
    return this._totalMembers
  }

  /**
   * @param {String} value
   */
  set totalMembers (value) {
    this._totalMembers = value
  }

  get totalMembersAttended () {
    return this._totalMembersAttended
  }

  /**
   * @param {String} value
   */
  set totalMembersAttended (value) {
    this._totalMembersAttended = value
  }

  get percentAttended () {
    return this._percentAttended
  }

  /**
   * @param {String} value
   */
  set percentAttended (value) {
    this._percentAttended = value
  }

  get memberFirstName () {
    return this._memberFirstName
  }

  /**
   * @param {Array} value
   */
  set memberFirstName (value) {
    this._memberFirstName = value
  }

  get memberLastName () {
    return this._memberLastName
  }

  /**
   * @param {Array} value
   */
  set memberLastName (value) {
    this._memberLastName = value
  }

  get attended () {
    return this._attended
  }

  /**
   * @param {Array} value
   */
  set attended (value) {
    this._attended = value
  }

  get meetingDate () {
    return this._meetingDate
  }

  /**
   * @param {String} value
   */
  set meetingDate (value) {
    this._meetingDate = value
  }

  get guestFirstName () {
    return this._guestFirstName
  }

  /**
   * @param {Array} value
   */
  set guestFirstName (value) {
    this._guestFirstName = value
  }

  get guestLastName () {
    return this._guestLastName
  }

  /**
   * @param {Array} value
   */
  set guestLastName (value) {
    this._guestLastName = value
  }

  get groupName () {
    return this._groupName
  }

  /**
   * @param {String} value
   */
  set groupName (value) {
    this._groupName = value
  }

  get groupId () {
    return this._groupId
  }

  /**
   * @param {String} value
   */
  set groupId (value) {
    this._groupId = value
  }
}

module.exports = {
  SmallGroupAttendanceReport
}
