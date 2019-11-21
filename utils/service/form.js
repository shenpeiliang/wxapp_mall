/**
 * 错误处理
 */
var validate = {
        /**
         * 只能输入数字
         */
        getIntNum: function(val, len) {
                val = val.replace(/[^\d]/g, "").replace(/^0{0,}/, "")

                if(len)
                        return val.substr(0, len)
                return val
        },
        /**
         * 只能输入数字和一个小数点
         */
        getNum: function (val, len) { 
                val = val.replace(/[^\d.]/g, "") //先把非数字的都替换掉，除了数字和.
                val = val.value.replace(/^\./g, "") //必须保证第一个为数字而不是.
                val = val.value.replace(/\.{2,}/g, ".") //保证只有出现一个.而没有多个.
                val = val.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //保证.只出现一次，而不能出现两次以上

                if (len)
                        return val.substr(0, len)
                return val
        },
        /**
         * 获取姓名
         */
        getName: function(val, len){
                val = val.replace(/[^A-Za-z\s|\u4E00-\u9FA5]/g, "")

                if (len)
                        return val.substr(0, len)
                return val
        },
        /**
         * 验证邮箱
         */
        isEmail: function(val) {
                var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

                if (!reg.test(val))
                        return false

                return true

        },
        /**
         * 是否是姓名
         */
        isName: function(val){
                var reg = /[A-Za-z\s|\u4E00-\u9FA5]/

                if (!reg.test(val))
                        return false

                return true
        },
        /**
         * 验证手机号
         */
        isTel: function(val) {
                var reg = /^1[0-9]{10}$/

                if (!reg.test(val))
                        return false

                return true
        },
        /**
         * 是否是验证码
         */
        isCode: function(val, len){
                len = len || config.codeLen

                if(len != val.length)
                        return false
                        
                return true
        },
        /**
         * 验证姓名
         */
        checkName: function(val){
                return this.getName(val, 80)
        },
        /**
         * 检查手机号
         */
        checkTel: function(val){
                val = this.getIntNum(val, 11)
                return val.replace(/^[^1]{1}/g, "1")
        },
        /**
         * 检查邮箱
         */
        checkEmail: function(val){
                return val.replace(/^[^a-zA-Z0-9\_\.]{1,}/g, "")
        },
        /**
         * 检查验证码
         */
        checkCode: function (val, len) {
                len = len || config.codeLen
                val = val.replace(/[^0-9a-zA-Z]/g, "")
                if (len)
                        return val.substr(0, len)

                return val
        },
}

var config = {
        codeLen: 6
}

//模块化处理
module.exports = {
        config: config,
        validate: validate
}