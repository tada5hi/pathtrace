/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { getPathValue } from '../../src';

describe('getPathValue', () => {
    it('returns the correct value', () => {
        const object = {
            hello: 'universe',
            universe: {
                hello: 'world',
            },
            world: ['hello', 'universe'],
            complex: [{
                hello: 'universe' 
            }, {
                universe: 'world' 
            }, [{
                hello: 'world' 
            }]],
        };

        const arr = [[true]];

        expect(getPathValue(object, 'hello')).toEqual('universe');
        expect(getPathValue(object, 'universe.hello')).toEqual('world');
        expect(getPathValue(object, 'world[1]')).toEqual('universe');
        expect(getPathValue(object, 'complex[1].universe')).toEqual('world');
        expect(getPathValue(object, 'complex[2][0].hello')).toEqual('world');
        expect(getPathValue(arr, '[0][0]')).toBeTruthy();
    });

    it('handles undefined objects and properties', () => {
        const object = {};

        expect(getPathValue(undefined, 'this.should.work')).toBeUndefined();
        expect(getPathValue(object, 'this.should.work')).toBeUndefined();
        expect(getPathValue('word', 'length')).toEqual(4);
    });
});

describe('avoid prototype pollution vulnerability', () => {
    it('exclude __proto__ via array path', () => {
        const obj = {};
        expect(getPathValue(obj, ['__proto__', 'constructor'])).toBeUndefined();
    });

    it('exclude __proto__ at non-first position via array path', () => {
        const obj = {
            a: {},
        };
        expect(getPathValue(obj, ['a', '__proto__', 'constructor'])).toBeUndefined();
    });

    it('exclude constructor via array path', () => {
        const obj = {};
        expect(getPathValue(obj, ['constructor', 'prototype'])).toBeUndefined();
    });

    it('exclude prototype via array path', () => {
        const obj = {};
        expect(getPathValue(obj, ['prototype', 'toString'])).toBeUndefined();
    });

    it('should not resolve a neighbouring path when a segment is unsafe', () => {
        const obj = {
            a: {
                b: 'safe' 
            } 
        };

        // Dropping `__proto__` would leave `a.b`, silently answering a
        // different question than the one that was asked.
        expect(getPathValue(obj, 'a.__proto__.b')).toBeUndefined();
        expect(getPathValue(obj, ['a', '__proto__', 'b'])).toBeUndefined();
        expect(getPathValue(obj, 'a.b')).toEqual('safe');
    });

    it('should not resolve an own unsafe key', () => {
        const obj = JSON.parse('{"__proto__":{"polluted":true}}');

        expect(getPathValue(obj, '__proto__')).toBeUndefined();
        expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });
});
