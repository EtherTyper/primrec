class TypeError extends Error {
    constructor(message) {
        super(message);
        this.name = "TypeError";
    }
}
class Fun {
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

const z = new Fun((_x) => 0, 1);
const s = new Fun((x) => x + 1, 1);
function id(i, n) {
    if (!(Number.isSafeInteger(i) && 1 <= i && i <= n)) throw new TypeError();
    return new Fun((...x) => x[i - 1], n);
}

function Cn(f, ...g) {
    if (f.arity != g.length) throw new TypeError();
    let m = g[0].arity;
    if (!g.every(gi => gi.arity == m)) throw new TypeError();
    return new Fun((...x) => f(...g.map(gi => gi(...x))), m);
}
function Pr(f, g) {
    let n = f.arity;
    function h(...args) {
        let x = args.slice(0, -1);
        let y = args[n];
        return y ? g(...x, y - 1, h(...x, y - 1)) : f(...x);
    }
    return new Fun(h, n + 1);
}
function Mn(f) {
    let n = f.arity - 1;
    return new Fun((...x) => {
        for (let y = 0;; y++) {
            if (!f(...x, y)) {
                return y;
            }
        }
    }, n);
}

const add = Pr(id(1, 1), Cn(s, id(3, 3)));
const mul = Pr(z, Cn(add, id(1, 3), id(3, 3)));
const pred = Cn(Pr(z, id(2, 3)), z, id(1, 1));
const sub = Pr(id(1, 1), Cn(pred, id(3, 3)));
const const1 = Cn(s, z);
const inv_sg = Cn(sub, const1, id(1, 1));
const sg = Cn(sub, const1, inv_sg);
const undef = Mn(Cn(s, id(1, 2)));
const eq = Cn(sub, Cn(const1, id(1, 2)), Cn(add, sub, Cn(sub, id(2, 2), id(1, 2))));
const geq = Cn(inv_sg, Cn(sub, id(2, 2), id(1, 2)));
const leq = Cn(geq, id(2, 2), id(1, 2));
const lt = Cn(inv_sg, geq);
const gt = Cn(inv_sg, leq);

// larger constructions
function select(offset, count, n) {
    return Array.from({ length: count }, (_v, i) => id(i + offset, n));
}
function restriction(f, C) {
    let n = f.arity;
    return Cn(Pr(Cn(z, id(1, n)), Cn(f, ...select(1, n, n + 2))), ...select(1, n, n), C);
}
function cases(f, C) {
    if (f.length != C.length) throw new TypeError();
    let restrictions = f.map((fi, index) => restriction(fi, C[index]));
    return restrictions.reduce((acc, current) => Cn(add, acc, current));
}

const max = cases([id(1, 2), id(2, 2)], [geq, Cn(inv_sg, geq)]);
const min = cases([id(1, 2), id(2, 2)], [Cn(inv_sg, geq), geq]);

const div = Mn(Cn(lt, Cn(mul, id(2, 3), Cn(s, id(3, 3))), Cn(s, id(1, 3))));
const mod = Cn(sub, id(1, 2), Cn(mul, id(2, 2), div));
