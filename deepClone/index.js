const normalList = [
    {
        a: [],
    },
    {
        b: [1, 2, 3],
    },
    {
        c: [1, [2, [3]]],
    },
    {
        d: {},
    },
    {
        e: {a: 1, b: 2, c: 3},
    },
    {
        f: {a1: 1, a2: {b1: 1, b2: {c1: 1, c2: 2}}},
    },
    {
        g: {a1: 1, a2: [1, {b1: 1, b2: [{c1: 1, c2: 2}]}]}
    }
]

function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function type(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
}

function isClone(data) {
    const t = type(data);
    return t === 'Object' || t === 'Array';
}

function clone(data) {
    if (!isClone(data)) return data

    const t = type(data)

    let res
    if (t === 'Array') {
        res = []
        for (let i = 0; i < data.length; i += 1) {
            res[i] = data[i] === data ? res : clone(data[i])
        }
    }
    if (t === 'Object') {
        res = {}
        for (let key in data) {
            if (hasOwnProp(data, key)) {
                res[key] = data[key] === data ? res : clone(data[key])
            }
        }
    }
    return res
}

function cloneLoop(data) {
    const t = type(data)
    let root;
    root = t === 'Array' ? [] : {}

    const loopList = [
        {
            parent: root,
            key: undefined,
            value: data
        }
    ]

    while (loopList.length) {
        let temp = loopList.pop()
        let {parent, key, value} = temp
        let tt = type(value)

        let res = parent
        if (typeof key !== 'undefined') {
            res = parent[key] = tt === 'Array' ? [] : {}
        }

        if (tt === 'Array') {
            for (let i = 0; i < value.length; i += 1) {
                if (value[i] === value) {
                    res[i] = value
                } else if (isClone(value[i])) {
                    loopList.push({
                        parent: res,
                        key: i,
                        value: value[i]
                    })
                } else {
                    res[i] = value[i]
                }
            }
        }

        if (tt === 'Object') {
            for (let x in value) {
                if (hasOwnProp(value, x)) {
                    if (value[x] === value) {
                        res[x] = value
                    } else if (isClone(x)) {
                        loopList.push({
                            parent: res,
                            key: x,
                            value: value[x]
                        })
                    } else {
                        res[x] = value[x]
                    }
                }
            }
        }
    }

    return root
}

cloneLoop(normalList)
