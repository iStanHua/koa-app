
const regs = {
    password: /[A-z]*[a-zA-Z][0-9][A-z0-9][_.@]*/,
    phoneNumber: /^1[3|5|6|7|8|9][0,9]{9}$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
    pureNumber: /^[0-9]*$/
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
     * 邮箱
     */
    email: (value) => {
        return regs.email.test(value)
    },
    /**
     * 纯数字
     */
    pureNumber: (value) => {
        return regs.pureNumber.test(value)
    }
}

module.exports = validate