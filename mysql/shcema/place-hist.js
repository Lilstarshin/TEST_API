const { error } = require('console')
const db = require('../model')

/**
 * @typedef ReviewHist
 * @property {String} regUserId
 * @property {String} placeId
 * @property {String} histType
 * @property {String} hist_comment
 */

const PlaceHist = {
  idx: 0,
  regUserId: '',
  placeId: '',
  histType: '',
  hist_comment: '',
  regDttm: '',
  column: `
  reg_user_id,
  place_id,
  hist_type,
  hist_comment,
  `,

  /** @param {String} placeId */
  /** @returns {Promise<EventHist[]> | []} */
  searchList: async (eventId) => {
    try {
      const query = `
        SELECT 
          ${PlaceHist.column}
        FROM event_info_hist
        WHERE event_id = ?
      `
      const conn = await db.getConnection()
      const params = [eventId]
      const result = await conn.query(query, params)
      conn.release()
      return result[0]
    } catch (e) {
      error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
      throw e
    }
  },
}
module.exports = PlaceHist
