export class TypeError extends Error {
    constructor(message) {
        super(message);
        this.name = "TypeError";
    }
}
export class Fun {
    fun;
    arity;

    constructor(fun, arity) {
        if (!Number.isSafeInteger(arity) || arity <= 0) throw new TypeError();
        this.fun = fun;
        this.arity = arity;

        return Object.assign(this.call.bind(this), this);
    }

    call(...args) {
        if (args.length != this.arity) throw new TypeError();
        // console.log(this.fun.toString(), ...args);
        return this.fun(...args);
    }
}

export const z = new Fun((_x) => 0, 1);
export const s = new Fun((x) => x + 1, 1);
export function id(i, n) {
    if (!(Number.isSafeInteger(i) && 1 <= i && i <= n)) throw new TypeError();
    return new Fun((...x) => x[i - 1], n);
}

export function Cn(f, ...g) {
    if (f.arity != g.length) throw new TypeError();
    let m = g[0].arity;
    if (!g.every(gi => gi.arity == m)) throw new TypeError();
    return new Fun((...x) => f(...g.map(gi => gi(...x))), m);
}
export function Pr(f, g) {
    let n = f.arity;
    function h(...args) {
        let x = args.slice(0, -1);
        let y = args[n];
        return y ? g(...x, y - 1, h(...x, y - 1)) : f(...x);
    }
    return new Fun(h, n + 1);
}
export function Mn(f) {
    let n = f.arity - 1;
    return new Fun((...x) => {
        for (let y = 0;; y++) {
            if (!f(...x, y)) {
                return y;
            }
        }
    }, n);
}
