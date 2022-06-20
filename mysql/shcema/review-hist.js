const { error } = require('console')
const db = require('../model')

/**
 * @typedef ReviewHist
 * @property {String} event_id
 * @property {String} event_type
 * @property {String} event_action
 * @property {String} def_content
 * @property {String} aft_content
 * @property {String} def_attachment_id
 * @property {String} aft_attachment_id
 * @property {Number} def_star_rating
 * @property {Number} aft_star_rating
 * @property {String} reg_dttm
 */

const ReviewHist = {
  column: `
  idx,
  event_id,
  event_type,
  event_action,
  def_content,
  aft_content,
  def_attachment_id,
  aft_attachment_id,
  def_star_rating,
  aft_star_rating,
  reg_dttm,
  `,

  /**
   * @param {EventHist} reviewHist
   * @returns {Promise<Boolean>}
   * */
  saveOne: async (reviewHist) => {
    // console.log('### IN REVUEW HIST : ', reviewHist)
    try {
      const query = `
        INSERT INTO 
          event_info_hist(
            event_id,
            event_type,
            event_action,
            bef_content,
            aft_content,
            bef_attachment_id,
            aft_attachment_id,
            bef_star_rating,
            aft_star_raintg
          ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? )
      `

      const conn = await db.getConnection()
      const params = [
        reviewHist.event_id,
        reviewHist.event_type,
        reviewHist.event_action,
        reviewHist.def_content,
        reviewHist.aft_content,
        reviewHist.def_attachment_id,
        reviewHist.aft_attachment_id,
        reviewHist.def_star_rating,
        reviewHist.aft_star_rating,
      ]
      // console.log(query, params)
      const result = await conn.query(query, params)
      conn.release()
      return result[0].affectedRows === 1
    } catch (e) {
      error(`[ERROR] DATABASE QUERY ERROR IN REVIEW_HIST ::${e}`)
      throw e
    }
  },
  /** @param {String} placeId */
  /** @returns {Promise<EventHist[]> | []} */
  searchList: async (eventId) => {
    try {
      const query = `
        SELECT 
          ${ReviewHist.column}
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
module.exports = ReviewHist
