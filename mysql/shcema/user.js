const { error } = require('console')
const db = require('../model')

/**
 * @typedef User
 * @property {String} user
 * @property {String} user_id
 * @property {String} user_email
 * @property {String} user_hashed_password:
 * @property {String} nickname
 * @property {String} token
 * @property {String} last_login_dttm
 * @property {Boolean} verified
 */

const User = {
  column: ` 
        user_id,
        user_hashed_password,
        nickname,
        token,
        use_yn,
        last_login_dttm,
        verified
        `,

  // /** @param {User} user */
  // /** @returns {Boolean} */
  // saveOne: async (user) => {},
  /** @param {String} userId */
  /** @returns {Promise<User> | undefined} */
  searchOne: async (userId) => {
    try {
      const query = `
      SELECT 
        ${User.column}
      FROM user_info
      WHERE user_id = ?
      `
      const conn = await db.getConnection()
      const params = [userId]
      const result = await conn.query(query, params)
      conn.release()
      return result[0][0]
    } catch (e) {
      error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
      throw e
    }
  },
}
module.exports = User
