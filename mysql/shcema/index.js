const Review = require('./review') // 이벤트 테이블
const ReviewHist = require('./review-hist') // 이벤트 이력관리 테이블
const Place = require('./place') // 장소 테이블
const PlaceHist = require('./place-hist') // 장소 이력관리 테이블
const User = require('./user') // 사용자 테이블
const UserHist = require('./user-hist') // 사용자 이력관리 테이블
const UserPointHist = require('./user-point-hist') // 사용자 포인트 이력관리 테이블

module.exports = {
  Review,
  ReviewHist,
  Place,
  PlaceHist,
  User,
  UserHist,
  UserPointHist,
}
