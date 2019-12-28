class SmallGroupLeader {
  constructor () {
    this._leaderFirstName = ''
    this._leaderLastName = ''
    this._leaderUserId = ''
    this._leaderToken = ''
    this._leaderType = ''
    this._createdDate = ''
    this._lastUpdated = ''
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
}

module.exports = {
  SmallGroupLeader
}
