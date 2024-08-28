/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
        const obj : any = { hello: 'world' };
        setPathValue(obj, 'hello', 'universe');
        expect(obj.hello).toEqual('universe');
    });

    it('allows value to be set in complex object', () => {
        const obj : any = { hello: {} };
        setPathValue(obj, 'hello.universe', 42);
        expect(obj.hello.universe).toEqual(42);
    });

    it('allows value to be re-set in complex object', () => {
        const obj = { hello: { universe: 100 } };
        setPathValue(obj, 'hello.universe', 42);
        expect(obj.hello.universe).toEqual(42);
    });

    it('allows for value to be set in array', () => {
        const obj = { hello: [] };
        setPathValue(obj, 'hello[0]', 1);
        setPathValue(obj, 'hello[2]', 3);

        expect(obj.hello[0]).toEqual(1);
        expect(obj.hello[1]).toBeUndefined();
        expect(obj.hello[2]).toEqual(3);
    });

    it('allows setting a value into an object inside an array', () => {
        const obj : any = { hello: [{ anObject: 'obj' }] };
        setPathValue(obj, 'hello[0].anotherKey', 'anotherValue');

        expect(obj.hello[0].anotherKey).toEqual('anotherValue');
    });

    it('allows for value to be re-set in array', () => {
        const obj = { hello: [1, 2, 4] };
        setPathValue(obj, 'hello[2]', 3);

        expect(obj.hello[0]).toEqual(1);
        expect(obj.hello[1]).toEqual(2);
        expect(obj.hello[2]).toEqual(3);
    });

    it('returns the object in which the value was set', () => {
        const obj = { hello: [1, 2, 4] };
        const valueReturned = setPathValue(obj, 'hello[2]', 3);
        expect(obj).toEqual(valueReturned);
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
});
