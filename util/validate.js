
const regs = {
    password: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,
    phoneNumber: /^1[3|5|6|7|8|9]\d{9}$/,
    telephone: /^0\d{2,3}-?\d{7,8}$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
    idCard: /^\d{15}$|^\d{17}[0-9Xx]$/,
    zipcode: /^[1-9][0-9]{5}$/,
    momey: /^-?\d*(\.\d{0,2})?$/,
    pureNumber: /^[0-9]*$/,
    currency: /(?!^)(?=(\d{3})+$)/g,
    phoneFormat: /(?!^)(?=(\d{4})+$)/g,
    trim: /\s/g,
    carNumber: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
    chinese: /[\u4E00-\u9FA5]/
}

const validate = {
    /**
     * 密码
     */
    password: (value) => {
        return regs.password.test(value)
    },
    /**
     * 手机号
     */
    phoneNumber: (value) => {
        return regs.phoneNumber.test(value)
    },
    /**
     * 电话
     */
    telephone: (value) => {
        return regs.telephone.test(value)
    },
    /**
     * 邮箱
     */
    email: (value) => {
        return regs.email.test(value)
    },
    /**
     * 身份证
     */
    idCard: (value) => {
        return regs.idCard.test(value)
    },
    /**
     * 邮政编码
     */
    zipcode: (value) => {
        return regs.zipcode.test(value)
    },
    /**
     * 金额
     */
    momey: (value) => {
        return regs.momey.test(value)
    },
    /**
     * 纯数字
     */
    pureNumber: (value) => {
        return regs.pureNumber.test(value)
    },
    /**
     * 货币格式
     */
    currency: (value) => {
        value = value.replace(/\,/g, '')
        return value.replace(regs.currency, ',')
    },
    /**
     * 手机格式
     */
    phoneFormat: (value) => {
        value = validate.trim(value)
        return value.replace(regs.phoneFormat, ' ')
    },
    /**
     * 清除所有空格
     */
    trim: (value) => {
        return value.replace(regs.trim, '')
    },
    /**
     * 车牌号
     */
    carNumber: (value) => {
        return regs.carNumber.test(value)
    },
    /**
     * 中文
     */
    chinese: (value) => {
        return regs.chinese.test(value)
    }
}

module.exports = validate