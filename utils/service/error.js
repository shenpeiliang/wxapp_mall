/**
 * 错误处理
 */
var service = {
        server: e => {
                //服务器记录
        },
        console: e => { //直接输出
                console.log('error输出：', e)
        }
}

//模块化处理
module.exports = {
        service: service
}