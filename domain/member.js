class SmallGroupMember {
  constructor () {
    this._memberName = ''
  }

  get memberName () {
    return this._memberName
  }

  /**
   * @param {String} value
   */
  set memberName (value) {
    this._memberName = value
  }
}

module.exports = {
  SmallGroupMember
}
