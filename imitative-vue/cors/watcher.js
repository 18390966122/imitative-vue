function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub (sub) {
        if(sub) {
            this.subs.push(sub)
        }
    },
    update () {
        Object.keys(this.subs).forEach((value, index) => {
            this.subs[index].update()
        })
    }
}
/**
 * 给节点node添加订阅者管理
 * @param {Object} vm 初始化 new Vue 的对象
 * @param {Object} node 需要添加订阅者管理的node节点
 * @param {String} name 是页面上的值的变量，比如： testText ， one.two
 * @param {Object} keys 获取node节点间的值类型  例如:input 是value;  div标签是innerHTML
 */
function Watcher(vm, node, name, keys) {
    Dep.target = this
    this.vm = vm
    this.node = node
    this.name = name
    this.keys = keys
    // oldValue 这是记住该node中字符串和变量混合书写的时候，记住其中变量的的上一个值，为了解决变量和字符串混合值的解析和同步改变，
    // 比如：<div>这是测试额外字符的 {{options}}</div> 解析div里面的options变量
    this.oldValue = {}
    this.update()
    Dep.target = null
}

Watcher.prototype = {
    update () {
        if (typeof this.name === 'object') {
            this.name.forEach(value => {
                this.replaceVariable(this.vm, value)
            })
        } else {
            this.replaceVariable(this.vm, this.name)
        }
    },
    translateKeys (vm, keys) { // 遍历字符串中的变量，并转换为值输出
        let array = keys.split('.')
        if (typeof vm.data[array[0]] === 'object') {
            return this.toVlalue(vm.data[array[0]])
        } else {
            return vm.data[array[0]]
        }
    },
    toVlalue (obj) { // 利用递归的方法，把多层对象的值遍历出来返回
        for (let k in obj) {
            if (typeof obj[k] === 'object') {
                this.toVlalue(obj[k])
            } else {
                return obj[k]
            }
        }
    },
    replaceVariable (vm, name) {
        let reg = /\{\{(.*)\}\}/
        let current = this.val || this.translateKeys(vm, name)
        if (reg.test(this.node[this.keys])) { // 判断是首次解析渲染还是渲染之后再改变这个变量
            this.node[this.keys] = this.node[this.keys].replace(`{{${name}}}`, this.translateKeys(this.vm, name))
        } else {
            this.node[this.keys] = this.node[this.keys].replace(this.oldValue[name], current)
        }
        this.oldValue[name] = current
    }
}


