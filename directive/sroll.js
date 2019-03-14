const vuesroll = {};

vuesroll.install = (Vue, options = {}) => {
    Vue.directive('sroll', {
        bind(el, binding, vnode) {
            // console.log('滚动指令测试测试');
            // console.log(el);
            // console.log(binding);
            // console.log(vnode);

            let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap'); 
            let scrollPosition = 0
            SCROLL_DOM.addEventListener('scroll', function () {
                // 当前的滚动位置 减去  上一次的滚动位置
                // 如果为true则代表向上滚动，false代表向下滚动
                let flagToDirection = this.scrollTop - scrollPosition > 0
                // 记录当前的滚动位置
                scrollPosition = this.scrollTop
                // console.log(flagToDirection ? '滚动方向：下' : '滚动方向：上')
                
                // 记录当前的滚动位置 
                const LIMIT_BOTTOM = 100
                // 记录滚动位置距离底部的位置
                let scrollBottom = this.scrollHeight - (this.scrollTop + this.clientHeight) < LIMIT_BOTTOM
                
                 // 如果已达到指定位置则触发
                // if (scrollBottom) { 
                if (this.scrollHeight - (this.scrollTop + this.clientHeight) == 0) { 
                    // console.log('可以重新进行数据加载了。');
                    // 将滚动行为告诉组件
                    binding.value(flagToDirection)
                    // this.cs();
                }
                
            })
            // 获取滚动页面DOM
            // let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
            // SCROLL_DOM.addEventListener('scroll', function () {
            //     console.log('scrll')
            // })
        }
    })
};

export default vuesroll;
