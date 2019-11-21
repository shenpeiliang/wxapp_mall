Component({
        properties: {
                maxSize: {
                        type: Number,
                        value: 8
                },
                placeholderText: {
                        type: String,
                        value: '请输入关键字'
                },
                keyTitle: {
                        type: String,
                        value: '搜索'
                },
                isFocus: {
                        type: Boolean,
                        value: true
                },
        },
        data: {
                searcherStorage: [],
                inputValue: ""
        },
        ready() {

                var winHeight
                wx.getSystemInfo({
                        success: function (res) {
                                winHeight = res.windowHeight
                        }
                });
                

                let searchData = wx.getStorageSync(this.id);
                this.setData({ 
                        searcherStorage: searchData || [],
                        windowHeight: winHeight
                });
        },
        methods: {          
                /**
                 * 输入
                 */
                bindInput(e) {
                        this.setData({ 
                                inputValue: e.detail.value 
                        })
                },
                /**
                 * 清除所有
                 */
                clearSearchStorage() {
                        wx.removeStorageSync(this.id)
                        this.setData({
                                searcherStorage: []
                        })
                },
                /**
                 * 使用具体搜索记录
                 */
                tapSearcherStorage(e) {
                        let index = e.currentTarget.dataset.id;
                        let searcherStorage = this.data.searcherStorage;
                        //指定的记录值
                        let chooseItem = searcherStorage.splice(index, 1)[0];
                        
                        //赋值 - 可以不用
                        this.setData({
                                inputValue: chooseItem
                                
                        })

                        //触发事件
                        this.bindSearchEvent(chooseItem);
                },
                /**
                 * 删除指定记录
                 */
                deteleSearcherStorage(e) {
                        let index = e.currentTarget.dataset.id;
                        //删除指定记录再重新保存
                        let searcherStorage = this.data.searcherStorage;
                        searcherStorage.splice(index, 1);
                        wx.setStorageSync(this.id, searcherStorage);
                        this.setData({ 
                                searcherStorage: searcherStorage
                        });
                },
                /**
                 * 确认搜索
                 */
                setSearchStorage(e) {
                        let that = this;
                        let inputValue = this.data.inputValue.trim();
                        let searchData = that.data.searcherStorage;

                        if (inputValue != '') {
                                //过滤 - 去掉等值的元素 - 后面再添加以排序至最新
                                searchData = searchData.filter((item) => item !== inputValue);

                                //删除最后一个
                                if (searchData.length >= this.data.maxSize) searchData.pop();

                                //添加到数组起始位置
                                searchData.unshift(inputValue);
                                wx.setStorageSync(this.id, searchData);
                                that.setData({
                                        searcherStorage: searchData,
                                        inputValue: ''
                                })

                                //触发事件
                                that.bindSearchEvent(inputValue);
                        } 
                },
                bindSearchEvent(inputVal) {
                        //触发事件
                        this.triggerEvent("searchEvent", inputVal);
                }
        }
})