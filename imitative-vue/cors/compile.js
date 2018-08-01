
function Compile(el, vm) {
    return this.nodeToFragment(el, vm)
}

Compile.prototype = {
    nodeToFragment(el, vm) { // 返回代码片段，直接把代码片段重新渲染进html里面
        let child = null;
        let frag = document.createDocumentFragment()
        while (child = el.firstChild) {
            this.nodeToVlue(child, vm) // 把循环元素node 把每个元素加进fragment里面
            frag.appendChild(child)
        }
        return frag
    },
    nodeToVlue(node, vm) {
        let reg = /\{\{(.*)\}\}/g
        let array = this.circulatedata(vm.data) // 这里利用递归的方法，把多层data的值和键做了处理,让页面上的变量对应的值和遍历出来的键值对相对应
        if (node.nodeType === 1) {
            let name = node.getAttribute('v-model')
            let html = node.innerHTML
            array.forEach((v, index) => {
                if (name === v.key) { // 属性为v-model，并且元素是select input textarea
                    if (node.nodeName === 'SELECT') {
                        let child = node.childNodes
                        Object.keys(child).forEach((value, index) => { // 遍历select的子节点 option  并设置选中的值
                            if (child[index].nodeType === 1) {
                                child[index].setAttribute('selected', false)
                                if (child[index].value === v.value) {
                                    child[index].setAttribute('selected', true)
                                }
                            }
                        })
                        node.addEventListener('change', function (e) {
                            vm.data[v.key] = e.target.value
                        })
                    } else {
                        node.addEventListener('input', function (e) {
                            vm.data[v.key] = e.target.value
                        })
                    }
                    node.value = v.value
                    new Watcher(vm, node, v.key, 'value')
                } else if (html !== '' && reg.test(html)) { // 普通的双标签元素，内容是{{}}格式的
                    let keysArray = this.toKeys(html)
                    new Watcher(vm, node, keysArray, 'innerHTML')
                }
            })
        }
        if (node.nodeType === 3) { // 文本格式的{{}}数据
            if (reg.test(node.nodeValue)) {
                let keysArray = this.toKeys(node.nodeValue)
                new Watcher(vm, node, keysArray, 'nodeValue')
            }
        }
    },
    circulatedata(data, arr, key) { // 这里利用递归方法，把data中的所有变量和值转换成  {key: data中数据对应在页面上书写形式的键, value：对应data的值}
        let array = arr || []
        for (let k in data) {
            let obj = {}
            obj.key = key || ''
            obj.value = null
            if (typeof data[k] === 'object') {
                let objKey = key ? (key + '.' + k) : k 
                this.circulatedata(data[k], array, objKey)
            } else {
                obj.key = obj.key === '' ? obj.key + k : obj.key + '.' + k
                obj.value = data[k]
                array.push(obj)
            }
        }
        return array
    },
    toKeys (str, array, index) { // 在有多层变量的时候，循环遍历出每个变量 比如：{{testText}}这是测试额外字符的 {{options}}，要把testText 和 options 变量分别提取出来
        let s = str.indexOf('{{')
        let e = str.indexOf('}}')
        let arr = array || []
        let i = index ? index : 1
        if(s >= 0 && e >= 0) {
            let start = s + 2
            let end = e
            arr.push(str.substring(start, end))
            this.toKeys(str.substring(e+2), arr, (i + 1))
        }
        return arr
    }
}
