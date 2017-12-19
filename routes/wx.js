const router = require('koa-router')()
const weixin = require('../controllers/weixin')

router.prefix('/wx')

router.get('/token', weixin.accessToken)
router.get('/ticket', weixin.getTicket)
router.get('/signature', weixin.getSignature)

router.post('/media/upload', weixin.uploadMedia)
router.get('/media/get', weixin.downloadMedia)
router.post('/media/uploadimg', weixin.uploadImg)

router.post('/message/custom/send', weixin.sendCustomMessage)

router.get('/user/get', weixin.getUser)
router.get('/user/info', weixin.userInfo)

router.post('/groups/create', weixin.createGroup)
router.post('/groups/update', weixin.updateGroup)
router.post('/groups/members/update', weixin.updateMembersGroup)
router.post('/groups/getid', weixin.getidGroup)
router.get('/groups/get', weixin.getGroups)

router.post('/menu/create', weixin.createMenu)
router.get('/menu/get', weixin.getMenu)
router.get('/menu/delete', weixin.deleteMenu)

router.post('/qrcode/create', weixin.createQrcode)
router.get('/qrcode/show', weixin.showQrcode)

router.get('/device/qrcode/get', weixin.getDeviceQrcode)
router.post('/device/authorize', weixin.authorizeDevice)
router.post('/device/qrcode/verify', weixin.verifyDeviceQrcode)
router.get('/device/status', weixin.getDeviceStatus)
router.post('/device/bind', weixin.bindDevice)
router.post('/device/bind/compel', weixin.compelBindDevice)
router.post('/device/unbind', weixin.unBindDevice)
router.post('/device/unbind/compel', weixin.compelUnbindDevice)
router.get('/device/openid/get', weixin.getDeviceOpenid)
router.get('/device/openid/bind', weixin.getDeviceOpenidBind)
router.get('/device/transmsg', weixin.transmsgDevice)

router.post('/card/create', weixin.createCard)
router.post('/card/qrcode/create', weixin.createQrcodeCard)
router.post('/card/testwhitelist/set', weixin.setTestwhitelistCard)
router.post('/card/consume', weixin.consumeCard)

router.post('/comment/open', weixin.openComment)
router.post('/comment/close', weixin.closeComment)
router.post('/comment/list', weixin.commentlist)
router.post('/comment/markelect', weixin.markelectComment)
router.post('/comment/unmarkelect', weixin.unmarkelectComment)
router.post('/comment/delete', weixin.deleteComment)
router.post('/comment/reply/add', weixin.addReplyComment)
router.post('/comment/reply/delete', weixin.deleteReplyComment)

module.exports = router