function observer(data, vm) {
    if (!data || typeof data !== 'object') {
        return false
    }
    Object.keys(data).forEach((value, index) => {
        observerReactive(data, value, data[value])
    })
}

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

















