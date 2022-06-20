// @ts-check
const express = require('express')
const { log, error } = require('console')
const { User, Place, Review, UserPointHist } = require('../mysql/shcema')

const router = express.Router()

/**
 * @typedef Input
 * @property {"REVIEW"} type   // "미리 정의된 string값 리뷰 이벤트의 경우 "REVIEW" "
 * @property {"ADD" | "MOD" | "DELETE"} action  // " 이벤트 생성:ADD 수정:MOD 삭제:DEL "
 * @property {string} reviewId // UUID 포맷 ID
 * @property {string} content // 리뷰 내용
 * @property {[string]} attachedPhotoIds // 첨부 이미지 ID
 * @property {string} userId // 리뷰 작성자 ID
 * @property {string} placeId // 장소 ID
 */
/**
 * @typedef Output
 * @property {Boolean} error
 * @property {String} msg
 */

/**
 * @param {Input} body
 * @returns {Input | undefined}
 */
function postArgumentCheck(body) {
  const event = body
  if (
    !event.type ||
    !event.action ||
    !event.reviewId ||
    !event.userId ||
    !event.placeId
  ) {
    return undefined
  }
  return event
}

/**
 * @param {Input} event
 * @returns {Promise<Output>}
 */
async function eventAddAction(event) {
  try {
    const user = await User.searchOne(event.userId)
    if (!user) {
      return {
        error: true,
        msg: '미등록 유저ID',
      }
    }

    const place = await Place.searchOne(event.placeId)
    if (!place) {
      return {
        error: true,
        msg: '미등록 장소ID',
      }
    }
    // console.log('place', place)
    const reviewList = await Review.searchList(place.place_id)
    // 리뷰가 있는 경우
    log('reviewList', reviewList)
    if (reviewList[0]) {
      const dupleReviewFind = reviewList.find(
        (reviewUser) => reviewUser.reg_user_id === user.user_id
      )
      // console.log('duple', dupleReviewFind)
      // 중복 리뷰가있는경우
      if (dupleReviewFind) {
        return {
          error: true,
          msg: '기등록 리뷰 존재.',
        }
      }
    }
    if (
      !(await Review.saveOne(
        {
          review_id: event.reviewId,
          place_id: place.place_id,
          reg_user_id: user.user_id,
          star_rating: 0,
          content: event.content,
          attachment_id: `${event.attachedPhotoIds}`,
        },
        {
          event_id: event.reviewId,
          event_type: event.type,
          event_action: event.action,
          def_content: '',
          aft_content: event.content,
          def_attachment_id: '',
          aft_attachment_id: `${event.attachedPhotoIds}`,
          def_star_rating: 0,
          aft_star_rating: 0,
        }
      ))
    ) {
      return {
        error: true,
        msg: '리뷰 등록 실패.',
      }
    }
    // const reviews = await Review.searchList(event.placeId)
    // console.log('reviews', reviews)

    // 첫번쨰 리뷰

    const point = await UserPointHist.searchOne(event.userId)

    // console.log('point', point)
    let calPoint = point ? point.total_point : 0
    calPoint += reviewList[0] ? 1 : 0
    calPoint += event.content.length >= 1 ? 1 : 0
    calPoint += event.attachedPhotoIds[0] ? 1 : 0

    if (
      !UserPointHist.saveOne({
        event_id: event.reviewId,
        user_id: event.userId,
        issuer: 'ReviewEvent',
        hist_type: 'SAVE',
        calcul_point: calPoint,
        total_point: calPoint,
        hist_comment: `리뷰 이벤트 ${calPoint} 적립`,
      })
    ) {
      return {
        error: true,
        msg: '리뷰 이벤트 적립 실패',
      }
    }
    return {
      error: false,
      msg: '리뷰 이벤트 적립 완료',
    }
  } catch (e) {
    error(`[ERROR] Unkown Error... ::${e}`)
    return {
      error: true,
      msg: '작업 중 에러 발생.',
    }
  }
}

/**
 * @param {Input} event
 * @returns {Promise<Output>}
 */
async function eventModAction(event) {
  try {
    const user = await User.searchOne(event.userId)
    if (!user) {
      return {
        error: true,
        msg: '미등록 유저ID',
      }
    }

    const place = await Place.searchOne(event.placeId)
    if (!place) {
      return {
        error: true,
        msg: '미등록 장소ID',
      }
    }
    // console.log('place', place)
    const reviewList = await Review.searchList(place.place_id)
    // 리뷰가 있는 경우
    if (!reviewList[0]) {
      return {
        error: true,
        msg: '해당 장소에 대한 리뷰가 없음.',
      }
    }
    const dupleReviewFind = reviewList.find(
      (reviewUser) => reviewUser.reg_user_id === user.user_id
    )
    // console.log('duple', dupleReviewFind)
    // 중복 리뷰가있는경우
    if (!dupleReviewFind) {
      return {
        error: true,
        msg: '기등록 리뷰 없음.',
      }
    }
    if (
      !Review.updateOne(
        {
          review_id: event.reviewId,
          place_id: place.place_id,
          reg_user_id: user.user_id,
          star_rating: 0,
          content: event.content,
          attachment_id: `${event.attachedPhotoIds}`,
        },
        {
          event_id: event.reviewId,
          event_type: event.type,
          event_action: event.action,
          def_content: dupleReviewFind.content,
          aft_content: event.content,
          def_attachment_id: dupleReviewFind.attachment_id,
          aft_attachment_id: `${event.attachedPhotoIds}`,
          def_star_rating: 0,
          aft_star_rating: 0,
        }
      )
    ) {
      return {
        error: true,
        msg: '리뷰 수정 실패.',
      }
    }

    const point = await UserPointHist.searchOneReviewId(
      event.reviewId,
      event.userId
    )
    // console.log(
    //   'reviewPoint',
    //   reviewList[0] ? 1 : 0,
    //   event.content.length >= 1 ? 1 : 0,
    //   event.attachedPhotoIds[0] ? 1 : 0
    // )
    let calPoint = 0
    calPoint += reviewList[0] ? 0 : 1
    calPoint += event.content.length >= 1 ? 1 : 0
    calPoint += event.attachedPhotoIds[0] ? 1 : 0
    let befTotalPoint = 0
    if (point) {
      const totalPointHist = await UserPointHist.searchOne(event.userId)
      // console.log('total', totalPointHist)
      befTotalPoint = totalPointHist.total_point - point.calcul_point
      befTotalPoint = befTotalPoint < 0 ? 0 : befTotalPoint
    } else {
      befTotalPoint = calPoint
    }
    // 포인트 이력이 있는 경우
    if (
      !UserPointHist.saveOne({
        event_id: event.reviewId,
        user_id: event.userId,
        issuer: 'ReviewEvent',
        hist_type: 'SAVE',
        calcul_point: calPoint,
        total_point: befTotalPoint + calPoint,
        hist_comment: `리뷰 이벤트 ${calPoint} 계산`,
      })
    ) {
      return {
        error: true,
        msg: '리뷰 이벤트 계산 실패',
      }
    }
    return {
      error: false,
      msg: '리뷰 이벤트 계산 완료',
    }
  } catch (e) {
    error(`[ERROR] DB Error... ::${e}`)
    return {
      error: true,
      msg: '작업 중 에러 발생.',
    }
  }
}

/**
 * @param {Input} event
 * @returns {Promise<Output>}
 */
async function eventDeleteAction(event) {
  try {
    const user = await User.searchOne(event.userId)
    if (!user) {
      return {
        error: true,
        msg: '미등록 유저ID',
      }
    }

    const place = await Place.searchOne(event.placeId)
    if (!place) {
      return {
        error: true,
        msg: '미등록 장소ID',
      }
    }
    // console.log('place', place)
    const reviewList = await Review.searchList(place.place_id)
    // 리뷰가 있는 경우
    if (!reviewList[0]) {
      return {
        error: true,
        msg: '해당 장소에 대한 리뷰가 없음.',
      }
    }
    const dupleReviewFind = reviewList.find(
      (reviewUser) => reviewUser.reg_user_id === user.user_id
    )
    // console.log('duple', dupleReviewFind)
    // 중복 리뷰가없는경우
    if (!dupleReviewFind) {
      return {
        error: true,
        msg: '기등록 리뷰 없음.',
      }
    }
    if (
      !Review.deleteOne(
        {
          review_id: event.reviewId,
          place_id: place.place_id,
          reg_user_id: user.user_id,
          star_rating: 0,
          content: event.content,
          attachment_id: `${event.attachedPhotoIds}`,
        },
        {
          event_id: event.reviewId,
          event_type: event.type,
          event_action: event.action,
          def_content: dupleReviewFind.content,
          aft_content: '',
          def_attachment_id: dupleReviewFind.attachment_id,
          aft_attachment_id: '',
          def_star_rating: 0,
          aft_star_rating: 0,
        }
      )
    ) {
      return {
        error: true,
        msg: '리뷰 삭제 실패.',
      }
    }
    const calculPointHist = await UserPointHist.searchOneReviewId(
      event.reviewId,
      event.userId
    )
    if (calculPointHist) {
      // 포인트 이력이 있는 경우
      const totalPointHist = await UserPointHist.searchOne(event.userId)

      const calculPoint = calculPointHist ? calculPointHist.calcul_point : 0
      let totalPoint = totalPointHist
        ? totalPointHist.total_point - calculPoint
        : 0
      totalPoint = totalPoint < 0 ? 0 : totalPoint

      if (
        !UserPointHist.saveOne({
          event_id: event.reviewId,
          user_id: event.userId,
          issuer: 'ReviewEvent',
          hist_type: 'SAVE',
          calcul_point: calculPoint,
          total_point: totalPoint,
          hist_comment: `리뷰 이벤트 ${calculPoint} 계산`,
        })
      ) {
        return {
          error: true,
          msg: '리뷰 이벤트 계산 실패',
        }
      }
    }
    return {
      error: false,
      msg: '리뷰 삭제 성공',
    }
  } catch (e) {
    error(`[ERROR] Server Error... ::${e}`)
    return {
      error: true,
      msg: '작업 중 에러 발생.',
    }
  }
}
// 메인에서 여러 게시판 글을 모아서 보여주는 라우트
router.post('/event', async (req, res) => {
  const event = postArgumentCheck(req.body)
  // console.log(event)
  if (!event) {
    res.send({
      error: true,
      msg: 'body 필수값 누락',
    })
  }
  if (event.action === 'ADD') {
    res.send(await eventAddAction(event))
  } else if (event.action === 'MOD') {
    res.send(await eventModAction(event))
  } else if (event.action === 'DELETE') {
    res.send(await eventDeleteAction(event))
  } else {
    res.send({
      error: true,
      msg: '잘못된 action',
    })
  }
})
router.get('/event/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.searchOne(id)
    if (!user) {
      res.send({
        error: true,
        msg: '미등록 유저ID',
      })
      return
    }
    const totalPointHist = await UserPointHist.searchOne(user.user_id)
    res.send({
      error: false,
      userId: `${user.user_id}`,
      point: totalPointHist ? totalPointHist.total_point : 0,
    })
  } catch (e) {
    error(`[ERROR] Server Error... ::${e}`)
    res.send({
      error: true,
      msg: '작업 중 에러 발생.',
    })
  }
})
module.exports = router
