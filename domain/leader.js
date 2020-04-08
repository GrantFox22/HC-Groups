class SmallGroupLeader {
  constructor () {
    this._leaderFirstName = ''
    this._leaderLastName = ''
    this._leaderUserId = ''
    this._leaderToken = ''
    this._leaderType = ''
    this._createdDate = ''
    this._lastUpdated = ''
    this._groupId = ''
    this._groupName = ''
    this._leaderId = ''
    this._leaderTypeDescription = ''
  }

  get leaderFirstName () {
    return this._leaderFirstName
  }

  /**
   * @param {String} value
   */
  set leaderFirstName (value) {
    this._leaderFirstName = value
  }

  get leaderLastName () {
    return this._leaderLastName
  }

  /**
   * @param {String} value
   */
  set leaderLastName (value) {
    this._leaderLastName = value
  }

  get leaderUserId () {
    return this._leaderUserId
  }

  /**
   * @param {String} value
   */
  set leaderUserId (value) {
    this._leaderUserId = value
  }

  get leaderToken () {
    return this._leaderToken
  }

  /**
   * @param {String} value
   */
  set leaderToken (value) {
    this._leaderToken = value
  }

  get leaderType () {
    return this._leaderType
  }

  /**
   * @param {String} value
   */
  set leaderType (value) {
    this._leaderType = value
  }

  get createdDate () {
    return this._createdDate
  }

  /**
   * @param {String} value
   */
  set createdDate (value) {
    this._createdDate = value
  }

  get lastUpdated () {
    return this._lastUpdated
  }

  /**
   * @param {String} value
   */
  set lastUpdated (value) {
    this._lastUpdated = value
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

  get groupName () {
    return this._groupName
  }

  /**
   * @param {String} value
   */
  set groupName (value) {
    this._groupName = value
  }

  get leaderId () {
    return this._leaderId
  }

  /**
   * @param {String} value
   */
  set leaderId (value) {
    this._leaderId = value
  }

  get leaderTypeDescription () {
    return this._leaderTypeDescription
  }

  /**
   * @param {String} value
   */
  set leaderTypeDescription (value) {
    this._leaderTypeDescription = value
  }
}

module.exports = {
  SmallGroupLeader
}
