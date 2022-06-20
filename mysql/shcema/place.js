const { error } = require('console')
const db = require('../model')
/**
 * @typedef Place
 * @property {Number} idx
 * @property {String} place_id
 * @property {String} place_type
 * @property {String} place_name
 * @property {String} place_description
 * @property {String} place_address
 * @property {Number} bookmark_cnt
 */

const Place = {
  column: `idx,
          place_id,
          place_type,
          place_name,
          place_description,
          place_address,
          bookmark_cnt`,

  /** @param {User} user */
  /** @returns {Boolean} */
  saveOne: async () => {
    // const query = ''
    // const params = []
    // const result = []
  },

  /** @param {String} placeId */
  /** @returns {Promise<Place> | undefined} */
  searchOne: async (placeId) => {
    try {
      const query = `
      SELECT 
        ${Place.column}
        FROM place_info
        WHERE place_id = ?
      `
      const conn = await db.getConnection()
      const params = [placeId]
      const result = await conn.query(query, params)
      conn.release()
      return result[0][0]
    } catch (e) {
      error(`[ERROR] DATABASE QUERY ERROR ::${e}`)
      throw e
    }
  },
}
module.exports = Place
