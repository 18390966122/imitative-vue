
function Compile(el, vm) {
    return this.nodeToFragment(el, vm)
}

Compile.prototype = {
    nodeToFragment (el, vm) {
        let child = null;
        let frag = document.createDocumentFragment()
        while(child = el.firstChild) {
            this.nodeToVlue(child, vm)
            frag.appendChild(child)
        }
        return frag
    },
    nodeToVlue (node, vm) {
        let reg = /\{\{(.*)\}\}/
        if (node.nodeType === 1) {
            let name = node.getAttribute('v-model')
            if (name === 'testText') {
                node.value = vm.data[name]
                node.addEventListener('input', function(e) {
                    vm.data[name] = e.target.value
                })
                new Watcher(vm, node, name, 'value')
            }
        }
        if (node.nodeType === 3) {
            if (reg.test(node.nodeValue)) {
                let name = RegExp.$1
                node.nodeValue = vm.data[name]
                new Watcher(vm, node, name, 'nodeValue')
            }
        }
    }
}
