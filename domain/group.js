class SmallGroup {
  constructor () {
    this._groupName = ''
    this._groupId = ''
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
  SmallGroup
}
