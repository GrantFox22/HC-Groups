class SmallGroupMember {
  constructor () {
    this._firstName = ''
    this._lastName = ''
    this._groupId = ''
    this._id = ''
  }

  get firstName () {
    return this._firstName
  }

  /**
   * @param {String} value
   */
  set firstName (value) {
    this._firstName = value
  }

  get lastName () {
    return this._lastName
  }

  /**
   * @param {String} value
   */
  set lastName (value) {
    this._lastName = value
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

  get id () {
    return this._id
  }

  /**
   * @param {String} value
   */
  set id (value) {
    this._id = value
  }
}

module.exports = {
  SmallGroupMember
}
