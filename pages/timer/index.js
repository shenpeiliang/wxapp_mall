// pages/timer/index.js
//https://www.jb51.net/article/143454.htm
let goodsList = [{
                actEndTime: '2019-06-04 10:52:43'
        },
        {
                actEndTime: '2019-06-04 10:51:03'
        },
        {
                actEndTime: '2018-04-28 03:00:11'
        }
]
Page({
        data: {
                countDownList: [],
                actEndTimeList: []
        },
        onLoad() {
                let endTimeList = []
                // 将活动的结束时间参数提成一个单独的数组，方便操作
                goodsList.forEach(o => {
                        endTimeList.push(o.actEndTime)
                })
                this.setData({
                        actEndTimeList: endTimeList
                })
                // 执行倒计时函数
                this.countDown()
        },
        timeFormat(param) { //小于10的格式化函数
                return param < 10 ? '0' + param : param
        },
        countDown() { //倒计时函数
                let timerName
                // 获取当前时间，同时得到活动结束时间数组
                let newTime = new Date().getTime()
                let endTimeList = this.data.actEndTimeList
                let countDownArr = []

                //如果都结束了就清除定时任务
                let i = 0
                let timerLen = endTimeList.length
                console.log('元素个数', timerLen)

                // 对结束时间进行处理渲染到页面
                endTimeList.forEach(o => {
                        let endTime = new Date(o).getTime()
                        let obj = null
                        // 如果活动未结束，对时间进行处理
                        if (endTime - newTime > 0) {
                                let time = (endTime - newTime) / 1000
                                // 获取天、时、分、秒
                                let day = parseInt(time / (60 * 60 * 24))
                                let hou = parseInt(time % (60 * 60 * 24) / 3600)
                                let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
                                let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
                                obj = {
                                        day: this.timeFormat(day),
                                        hou: this.timeFormat(hou),
                                        min: this.timeFormat(min),
                                        sec: this.timeFormat(sec)
                                }
                        } else { //活动已结束，全部设置为'00'
                                obj = {
                                        day: '00',
                                        hou: '00',
                                        min: '00',
                                        sec: '00'
                                }
                                i++
                        }
                        countDownArr.push(obj)
                })
                // 渲染，然后每隔一秒执行一次倒计时函数
                this.setData({
                        countDownList: countDownArr
                })

                //清除定时器
                if (timerLen == i) {
                        clearTimeout(timerName)
                        console.log('关闭定时器')
                } else {
                        timerName = setTimeout(this.countDown, 1000)
                }

        }
})