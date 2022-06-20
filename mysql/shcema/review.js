const { error } = require('console')
const db = require('../model')
const ReviewHist = require('./review-hist')

/**
 * @typedef Review
 * @property {String} review_id
 * @property {String} place_id
 * @property {String} reg_user_id
 * @property {Number} star_rating
 * @property {String} content
 * @property {String} attachment_id
 */
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
 */

const Review = {
  column: `event_id,
          place_id,
          reg_user_id,
          star_rating,
          content,
          attachment_id`,

  /**
   * @param {Review} review
   * @param {ReviewHist} reviewHistData
   * @returns {Boolean}
   */
  updateOne: async (review, reviewHistData) => {
    try {
      const query = `
      UPDATE event_info SET 
        star_rating = ?,
        content = ?,
        attachment_id = ?
      WHERE event_id = ? AND place_id = ? AND reg_user_id = ?
    `
      const conn = await db.getConnection()
      const params = [
        review.star_rating,
        review.content,
        `${review.attachment_id}`,
        review.review_id,
        review.place_id,
        review.reg_user_id,
      ]
      try {
        // TRANSACTION

        const result = await conn.query(query, params)
        await ReviewHist.saveOne({
          event_id: review.review_id,
          event_type: reviewHistData.event_type,
          event_action: reviewHistData.event_action,
          def_content: reviewHistData.def_content,
          aft_content: reviewHistData.aft_content,
          def_attachment_id: reviewHistData.def_attachment_id,
          aft_attachment_id: reviewHistData.aft_attachment_id,
          def_star_rating: reviewHistData.def_star_rating,
          aft_star_rating: reviewHistData.aft_star_rating,
        })
        // COMMIT

        conn.release()
        return result[0].affectedRows === 1
      } catch (e) {
        // ROLLBACK

        conn.release()
        error(`[ERROR] DB QUERY ERROR IN REVIEW ::${e}`)
        return false
      }
    } catch (e) {
      error(`[ERROR] DB CONNECTION ERROR IN REVIEW ::${e} `)
      return false
    }
  },
  deleteOne: async (review, reviewHistData) => {
    try {
      const query = `
      DELETE FROM event_info
      WHERE event_id = ? AND place_id = ? AND reg_user_id = ?
      LIMIT 1
    `
      const conn = await db.getConnection()
      const params = [review.review_id, review.place_id, review.reg_user_id]
      try {
        // TRANSACTION

        const result = await conn.query(query, params)
        await ReviewHist.saveOne({
          event_id: review.review_id,
          event_type: reviewHistData.event_type,
          event_action: reviewHistData.event_action,
          def_content: reviewHistData.def_content,
          aft_content: reviewHistData.aft_content,
          def_attachment_id: reviewHistData.def_attachment_id,
          aft_attachment_id: reviewHistData.aft_attachment_id,
          def_star_rating: reviewHistData.def_star_rating,
          aft_star_rating: reviewHistData.aft_star_rating,
        })
        // COMMIT

        conn.release()
        return result[0].affectedRows === 1
      } catch (e) {
        // ROLLBACK

        conn.release()
        error(`[ERROR] DB QUERY ERROR IN REVIEW ::${e}`)
        return false
      }
    } catch (e) {
      error(`[ERROR] DB CONNECTION ERROR IN REVIEW ::${e} `)
      return false
    }
  },
  /**
   * @param {Review} review
   * @param {ReviewHist} reviewHistData
   * @returns {Boolean}
   */
  saveOne: async (review, reviewHistData) => {
    try {
      const query = `
      INSERT INTO 
        event_info(
          ${Review.column}
        ) VALUES ( ? , ? , ? , ? , ? , ? )
    `

      const conn = await db.getConnection()
      const params = [
        review.review_id,
        review.place_id,
        review.reg_user_id,
        review.star_rating,
        review.content,
        `${review.attachment_id}`,
      ]

      try {
        // TRANSACTION

        const result = await conn.query(query, params)

        await ReviewHist.saveOne({
          event_id: review.review_id,
          event_type: reviewHistData.event_type,
          event_action: reviewHistData.event_action,
          def_content: reviewHistData.def_content,
          aft_content: reviewHistData.aft_content,
          def_attachment_id: reviewHistData.def_attachment_id,
          aft_attachment_id: reviewHistData.aft_attachment_id,
          def_star_rating: reviewHistData.def_star_rating,
          aft_star_rating: reviewHistData.aft_star_rating,
        })
        // COMMIT

        conn.release()
        return result[0].affectedRows === 1
      } catch (e) {
        // ROLLBACK

        conn.release()
        error(`[ERROR] DB QUERY ERROR IN REVIEW ::${e}`)
        return false
      }
    } catch (e) {
      error(`[ERROR] DB CONNECTION ERROR IN REVIEW ::${e} `)
      return false
    }
  },
  /** @param {String} placeId */
  /** @returns {Promise<Review[]> | []} */
  searchList: async (placeId) => {
    try {
      const query = `
        SELECT 
          ${Review.column}
        FROM event_info
        WHERE place_id = ?
      `
      // console.log(query)
      const conn = await db.getConnection()
      const params = [placeId]
      const result = await conn.query(query, params)
      conn.release()
      return result[0]
    } catch (e) {
      error(`[ERROR] DB QUERY ERROR IN review-searchList ::${e}`)
      throw e
    }
  },
}
module.exports = Review
