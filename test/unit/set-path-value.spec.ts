/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { setPathValue } from '../../src';

describe('setPathValue', () => {
    it('allows value to be set in simple object', () => {
        const obj : any = {};
        setPathValue(obj, 'hello', 'universe');
        expect(obj.hello).toEqual('universe');
    });

    it('allows nested object value to be set', () => {
        const obj : any = {};
        setPathValue(obj, 'hello.universe', 'properties');
        expect(obj.hello.universe).toEqual('properties');
    });

    it('allows nested array value to be set', () => {
        const obj : any = {};
        setPathValue(obj, 'hello.universe[1].properties', 'galaxy');
        expect(obj.hello.universe[1].properties).toEqual('galaxy');
    });

    it('allows value to be re-set in simple object', () => {
        const obj : any = {
            hello: 'world' 
        };
        setPathValue(obj, 'hello', 'universe');
        expect(obj.hello).toEqual('universe');
    });

    it('allows value to be set in complex object', () => {
        const obj : any = {
            hello: {} 
        };
        setPathValue(obj, 'hello.universe', 42);
        expect(obj.hello.universe).toEqual(42);
    });

    it('allows value to be re-set in complex object', () => {
        const obj = {
            hello: {
                universe: 100 
            } 
        };
        setPathValue(obj, 'hello.universe', 42);
        expect(obj.hello.universe).toEqual(42);
    });

    it('allows for value to be set in array', () => {
        const obj = {
            hello: [] 
        };
        setPathValue(obj, 'hello[0]', 1);
        setPathValue(obj, 'hello[2]', 3);

        expect(obj.hello[0]).toEqual(1);
        expect(obj.hello[1]).toBeUndefined();
        expect(obj.hello[2]).toEqual(3);
    });

    it('allows setting a value into an object inside an array', () => {
        const obj : any = {
            hello: [{
                anObject: 'obj' 
            }] 
        };
        setPathValue(obj, 'hello[0].anotherKey', 'anotherValue');

        expect(obj.hello[0].anotherKey).toEqual('anotherValue');
    });

    it('allows for value to be re-set in array', () => {
        const obj = {
            hello: [1, 2, 4] 
        };
        setPathValue(obj, 'hello[2]', 3);

        expect(obj.hello[0]).toEqual(1);
        expect(obj.hello[1]).toEqual(2);
        expect(obj.hello[2]).toEqual(3);
    });

    it('returns the object in which the value was set', () => {
        const obj = {
            hello: [1, 2, 4] 
        };
        const valueReturned = setPathValue(obj, 'hello[2]', 3);
        expect(obj).toEqual(valueReturned);
    });
});

describe('intermediate container kind', () => {
    // The container created at a key must be decided by the *next* segment.
    // Deciding from the current key builds `{ a: { '0': [] } }` for `a[0].b`:
    // structurally wrong, and the value is hung off an array as a non-index
    // property, so it survives a property read but not serialization.

    it('creates an array when the next segment is numeric', () => {
        const obj: Record<string, any> = {};
        setPathValue(obj, 'items.0.name', 'x');

        expect(Array.isArray(obj.items)).toBe(true);
        expect(obj).toEqual({
            items: [{
                name: 'x' 
            }] 
        });
    });

    it('creates an array for bracket notation too', () => {
        const obj: Record<string, any> = {};
        setPathValue(obj, 'a[0].b', 1);

        expect(Array.isArray(obj.a)).toBe(true);
        expect(obj).toEqual({
            a: [{
                b: 1 
            }] 
        });
    });

    it('creates a plain object when the next segment is not numeric', () => {
        const obj: Record<string, any> = {};
        setPathValue(obj, 'a.b.c', 1);

        expect(Array.isArray(obj.a)).toBe(false);
        expect(obj).toEqual({
            a: {
                b: {
                    c: 1 
                } 
            } 
        });
    });

    it('survives a JSON round-trip', () => {
        // The regression this guards: non-index properties on an array are
        // dropped by JSON.stringify and structuredClone, so the value
        // disappears at any serialization boundary (an API response body,
        // postMessage, IndexedDB) while still reading back in memory.
        const obj: Record<string, any> = {};
        setPathValue(obj, 'items.0.name', 'alpha');

        expect(JSON.parse(JSON.stringify(obj))).toEqual({
            items: [{
                name: 'alpha' 
            }] 
        });
        expect(structuredClone(obj)).toEqual({
            items: [{
                name: 'alpha' 
            }] 
        });
    });

    it('keeps a deep mixed path structurally correct', () => {
        const obj: Record<string, any> = {};
        setPathValue(obj, 'a.0.b.1.c', 'deep');

        // The hole at `b[0]` serializes as null, per JSON semantics.
        expect(JSON.parse(JSON.stringify(obj)))
            .toEqual({
                a: [{
                    b: [null, {
                        c: 'deep' 
                    }] 
                }] 
            });
    });

    it('does not replace an existing object intermediate', () => {
        const obj: Record<string, any> = {
            a: {
                keep: 1 
            } 
        };
        setPathValue(obj, 'a.b', 2);

        expect(obj).toEqual({
            a: {
                keep: 1,
                b: 2 
            } 
        });
    });

    it('does not replace an existing array intermediate', () => {
        const obj: Record<string, any> = {
            a: [10, 20] 
        };
        setPathValue(obj, 'a.0', 99);

        expect(Array.isArray(obj.a)).toBe(true);
        expect(obj.a).toEqual([99, 20]);
    });
});

describe('non-traversable intermediates', () => {
    // Previously the guard was `typeof temp[key] === 'undefined'`, so a
    // pre-existing null or primitive was neither replaced nor traversable —
    // the loop bailed and the write vanished with no return value or throw
    // to signal it. `{ address: null }` is ordinary initial state.

    it('replaces a null intermediate instead of dropping the write', () => {
        const obj: Record<string, any> = {
            a: null 
        };
        setPathValue(obj, 'a.b', 1);

        expect(obj).toEqual({
            a: {
                b: 1 
            } 
        });
    });

    it('replaces a string intermediate', () => {
        const obj: Record<string, any> = {
            a: 'str' 
        };
        setPathValue(obj, 'a.b', 1);

        expect(obj).toEqual({
            a: {
                b: 1 
            } 
        });
    });

    it('replaces a numeric intermediate', () => {
        const obj: Record<string, any> = {
            a: 0 
        };
        setPathValue(obj, 'a.b', 1);

        expect(obj).toEqual({
            a: {
                b: 1 
            } 
        });
    });

    it('replaces a null intermediate with an array when indexed numerically', () => {
        const obj: Record<string, any> = {
            a: null 
        };
        setPathValue(obj, 'a.0', 'first');

        expect(Array.isArray(obj.a)).toBe(true);
        expect(obj.a).toEqual(['first']);
    });

    it('still overwrites a primitive at the final segment', () => {
        const obj: Record<string, any> = {
            a: 'str' 
        };
        setPathValue(obj, 'a', 'replaced');

        expect(obj).toEqual({
            a: 'replaced' 
        });
    });
});

describe('avoid prototype pollution vulnerability', () => {
    it('exclude constructor', () => {
        const obj = {};
        expect(typeof obj.constructor).toEqual('function');
        setPathValue(obj, 'constructor', null);
        expect(typeof obj.constructor).toEqual('function');
    });

    it('exclude __proto__', () => {
        const obj : any = {};
        // eslint-disable-next-line no-proto
        expect(obj.__proto__).toEqual({});
        setPathValue(obj, '__proto__', true);
        // eslint-disable-next-line no-proto
        expect(obj.__proto__).toEqual({});
    });

    it('exclude prototype', () => {
        const obj : any = {};
        expect(obj.prototype).toBeUndefined();
        setPathValue(obj, 'prototype', true);
        expect(obj.prototype).toBeUndefined();
    });

    it('exclude __proto__ via array path', () => {
        const obj : Record<string, any> = {};
        setPathValue(obj, ['__proto__', 'polluted'], 'yes');
        expect(obj.polluted).toBeUndefined();
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('exclude __proto__ at non-first position via array path', () => {
        const obj : Record<string, any> = {
            a: {},
        };
        setPathValue(obj, ['a', '__proto__', 'polluted'], 'yes');
        expect(obj.a.polluted).toBeUndefined();
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('exclude constructor via array path', () => {
        const obj : Record<string, any> = {};
        setPathValue(obj, ['constructor', 'prototype', 'polluted'], 'yes');
        expect(obj.polluted).toBeUndefined();
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('exclude prototype via array path', () => {
        const obj : Record<string, any> = {};
        setPathValue(obj, ['prototype', 'polluted'], 'yes');
        expect(obj.polluted).toBeUndefined();
        expect((Object.prototype as any).polluted).toBeUndefined();
    });
});

describe('unsafe segments do not redirect the write', () => {
    it('should not write to a neighbouring path', () => {
        const obj : Record<string, any> = {
            a: {} 
        };

        // Dropping `__proto__` would leave `a.x`, writing somewhere the
        // caller never named.
        setPathValue(obj, 'a.__proto__.x', 'yes');

        expect(obj.a).toEqual({});
        expect(({} as Record<string, unknown>).x).toBeUndefined();
    });
});
