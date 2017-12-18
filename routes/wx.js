const router = require('koa-router')()
const weixin = require('../controllers/weixin')

router.prefix('/wx')

router.get('/token', weixin.accessToken)
router.get('/media/upload', weixin.uploadMedia)
router.get('/media/get', weixin.downloadMedia)
router.get('/media/uploadimg', weixin.uploadImg)
router.get('/message/custom/send', weixin.sendCustomMessage)
router.get('/user/get', weixin.getUser)
router.get('/user/info', weixin.userInfo)
router.get('/groups/create', weixin.createGroup)
router.get('/groups/update', weixin.updateGroup)
router.get('/groups/members/update', weixin.updateMembersGroup)
router.get('/groups/getid', weixin.getidGroup)
router.get('/groups/get', weixin.getGroups)

module.exports = router