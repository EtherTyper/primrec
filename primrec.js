import { s, z, id, Cn, Pr, Mn } from './core.js';

export const add = Pr(id(1, 1), Cn(s, id(3, 3)));
export const mul = Pr(z, Cn(add, id(1, 3), id(3, 3)));
export const pred = Cn(Pr(z, id(2, 3)), z, id(1, 1));
export const sub = Pr(id(1, 1), Cn(pred, id(3, 3)));
export const const1 = Cn(s, z);
export const inv_sg = Cn(sub, const1, id(1, 1));
export const sg = Cn(sub, const1, inv_sg);
export const undef = Mn(Cn(s, id(1, 2)));
export const eq = Cn(sub, Cn(const1, id(1, 2)), Cn(add, sub, Cn(sub, id(2, 2), id(1, 2))));
export const geq = Cn(inv_sg, Cn(sub, id(2, 2), id(1, 2)));
export const leq = Cn(geq, id(2, 2), id(1, 2));
export const lt = Cn(inv_sg, geq);
export const gt = Cn(inv_sg, leq);

// larger constructions
export function select(offset, count, n) {
    return Array.from({ length: count }, (_v, i) => id(i + offset, n));
}
export function restriction(f, C) {
    let n = f.arity;
    return Cn(Pr(Cn(z, id(1, n)), Cn(f, ...select(1, n, n + 2))), ...select(1, n, n), C);
}
export function cases(f, C) {
    if (f.length != C.length) throw new TypeError();
    let restrictions = f.map((fi, index) => restriction(fi, C[index]));
    return restrictions.reduce((acc, current) => Cn(add, acc, current));
}
export function graph(f) {
    let n = f.arity;
    return Cn(eq, Cn(f, ...select(1, n, n + 1)), id(n + 1, n + 1));
}
export function bounded_exist(f) {
    return Cn(sg, Cn(Pr(z, Cn(add, Cn(f, id(2, 3)), id(3, 3))), z, Cn(s, id(1, 1))));
}

const max = cases([id(1, 2), id(2, 2)], [geq, Cn(inv_sg, geq)]);
const min = cases([id(1, 2), id(2, 2)], [Cn(inv_sg, geq), geq]);

const existsgeq2 = bounded_exist(Cn(leq, Cn(Cn(s, s), z), id(1, 1)));
console.log(existsgeq2(0), existsgeq2(1), existsgeq2(2), existsgeq2(3));

// const find_n = bounded_exist(eq)

// const div = Mn(Cn(lt, Cn(mul, id(2, 3), Cn(s, id(3, 3))), Cn(s, id(1, 3))));
// const mod = Cn(sub, id(1, 2), Cn(mul, id(2, 2), div));

// const prime = ;
