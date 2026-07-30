/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { removePath } from '../../src';

describe('removePath', () => {
    it('should remove simple path', () => {
        const object = {
            hello: 'universe',
            foo: 'bar',
        };

        removePath(object, 'hello');

        const keys = Object.keys(object);
        expect(keys).toHaveLength(1);
        expect(keys).toEqual(['foo']);
    });

    it('should remove nested path', () => {
        const object = {
            universe: {
                hello: 'world',
                foo: 'bar',
            },
            world: ['hello', 'universe'],
        };

        removePath(object, 'universe.foo');
        removePath(object, 'world[1]');

        expect(object.universe).toEqual({ hello: 'world' });
        expect(object.world).toEqual(['hello']);
    });

    it('should not remove non existent path', () => {
        const object = { hello: 'universe' };

        removePath(object, 'foo.bar');

        expect(object).toEqual(object);
    });
});

describe('avoid prototype pollution vulnerability', () => {
    it('exclude __proto__ via string path', () => {
        const obj : Record<string, any> = {};
        removePath(obj, '__proto__');
        expect(typeof obj.constructor).toEqual('function');
    });

    it('exclude constructor via string path', () => {
        const obj : Record<string, any> = {};
        removePath(obj, 'constructor');
        expect(typeof obj.constructor).toEqual('function');
    });

    it('exclude __proto__ via array path', () => {
        const obj : Record<string, any> = {};
        removePath(obj, ['__proto__', 'polluted']);
        expect(obj.polluted).toBeUndefined();
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('exclude __proto__ at non-first position via array path', () => {
        const obj : Record<string, any> = { a: {} };
        removePath(obj, ['a', '__proto__', 'toString']);
        expect(obj.a.toString).toBeDefined();
        expect((Object.prototype as any).toString).toBeDefined();
    });

    it('exclude constructor via array path', () => {
        const obj : Record<string, any> = {};
        removePath(obj, ['constructor', 'prototype']);
        expect(typeof obj.constructor).toEqual('function');
        expect((Object.prototype as any).constructor).toBeDefined();
    });
});

describe('unsafe segments do not redirect the removal', () => {
    it('should not remove a neighbouring path', () => {
        const obj : Record<string, any> = { a: { x: 1 } };

        removePath(obj, 'a.__proto__.x');

        expect(obj.a).toEqual({ x: 1 });
    });
});
