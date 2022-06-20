/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */
const { log } = require('console')
const supertest = require('supertest')
const app = require('../app')

const request = supertest(app)
const review = {
  type: 'REVIEW',
  action: 'ADD',
  reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
  content: '좋아요!',
  attachedPhotoIds:
    '["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"]',
  userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
  placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
}

// ADD ACTION
test('event post ADD ', async () => {
  const result = await request.post(`/event`).send(review)
  log(result.body)

  expect(result.body).toMatchObject({
    error: false,
    msg: '리뷰 이벤트 적립 완료',
  })
})
// MOD ACTION
test('event post MOD ', async () => {
  review.action = 'MOD'
  review.content = ''
  const result = await request.post(`/event`).send(review)
  log(result.body)

  expect(result.body).toMatchObject({
    error: false,
    msg: '리뷰 이벤트 계산 완료',
  })
})
// SEARCH POINT
test('event get point', async () => {
  const result = await request
    .get(`/event/${review.userId}`)
    .accept('application/json')
  log(result.body)

  expect(result.body).toMatchObject({
    error: false,
    userId: review.userId,
    point: 2,
  })
})
// DELETE ACTION
test('event post DELETE ', async () => {
  review.action = 'DELETE'
  const result = await request.post(`/event`).send(review)
  log(result.body)

  expect(result.body).toMatchObject({
    error: false,
    msg: '리뷰 삭제 성공',
  })
})
