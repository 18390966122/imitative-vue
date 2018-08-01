/**
 *遍历data函数，把data中的每一个变量属性提取出来,并调用observerReactive函数
 * @param {Object} data 初始化 new Vue 的对象
 * @param {Object} vm 需要添加订阅者管理的node节点
 */
function observer(data, vm) {
    if (!data || typeof data !== 'object') {
        return false
    }
    Object.keys(data).forEach((value, index) => {
        observerReactive(data, value, data[value])
    })
}
/**
 * 给每个data数据中的属性变量添加get和set函数，在get函数中把node并添加到订阅者数组里面，在set函数中更新页面数据
 * @param {Object} data 变量
 * @param {Object} keys 变量属性
 * @param {Object} value 初始的变量值
 */
function observerReactive(data, keys, value) {
    let dep = new Dep()
    observer(keys)
    Object.defineProperty(data, keys, {
        enumerable: true,
        cofigurable: false,
        get: function() {
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return value
        },
        set: function(newVal) {
            if (newVal !== value) {
                value = newVal
                dep.update()
            }
        }
    })
}

















