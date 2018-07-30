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


function Watcher(vm, node, name, keys) {
    Dep.target = this
    this.vm = vm
    this.node = node
    this.name = name
    this.keys = keys
    this.update()
    Dep.target = null
}

Watcher.prototype = {
    update () {
        this.node[this.keys] = this.vm.data[this.name]
    }
}


