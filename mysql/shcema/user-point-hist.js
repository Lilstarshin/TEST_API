const { error } = require('console')
const db = require('../model')

/**
 * @typedef UserPointHist
 * @property {String} event_id
 * @property {String} user_id
 * @property {String} issuer
 * @property {String} hist_type
 * @property {Number} calcul_point
 * @property {Number} total_point
 * @property {String} hist_comment
 */

const UserPointHist = {
  column: `
  event_id,
  user_id,
  issuer,
  hist_type,
  calcul_point,
  total_point,
  hist_comment
  `,
  /**
   * @param {UserPointHist} pointHist
   * @returns {Boolean}
   * */
  saveOne: async (pointHist) => {
    try {
      const query = `
        INSERT INTO 
        user_point_hist(
            ${UserPointHist.column}
          ) VALUES ( ? , ? , ? , ? , ? , ? , ?  )
      `
      const conn = await db.getConnection()
      const params = [
        pointHist.event_id,
        pointHist.user_id,
        pointHist.issuer,
        pointHist.hist_type,
        pointHist.calcul_point,
        pointHist.total_point,
        pointHist.hist_comment,
      ]
      const result = await conn.query(query, params)
      conn.release()
      // log(result[0])
      return result[0]
    } catch (e) {
      error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
      throw e
    }
  },
  /**
   * @param {String} eventId
   * @param {String} userId
   * @returns {Promise<UserPointHist> | undefined}
   * */
  searchOneReviewId: async (eventId, userId) => {
    try {
      const conn = await db.getConnection()
      try {
        const query = `
          SELECT idx,
            ${UserPointHist.column}
          FROM user_point_hist
          WHERE event_id = ? AND user_id = ?
          ORDER BY reg_dttm DESC
          LIMIT 1
        `
        // console.log(query, eventId, userId)

        const params = [eventId, userId]
        const result = await conn.query(query, params)
        conn.release()
        return result[0][0]
      } catch (e) {
        conn.release()
        error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
        throw e
      }
    } catch (e) {
      error(`[ERROR] DB CONNECTION ERROR IN REVIEW ::${e} `)
      throw e
    }
  },
  /**
   * @param {String} userId
   * @returns {Promise<UserPointHist> | undefined}
   * */
  searchOne: async (userId) => {
    try {
      const conn = await db.getConnection()
      try {
        const query = `
          SELECT idx,
            ${UserPointHist.column}
          FROM user_point_hist
          WHERE  user_id = ?
          ORDER BY reg_dttm DESC
          LIMIT 1
        `
        // console.log(query, eventId, userId)

        const params = [userId]
        const result = await conn.query(query, params)
        conn.release()
        return result[0][0]
      } catch (e) {
        conn.release()
        error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
        throw e
      }
    } catch (e) {
      error(`[ERROR] DB CONNECTION ERROR IN REVIEW ::${e} `)
      throw e
    }
  },
}

module.exports = UserPointHist
