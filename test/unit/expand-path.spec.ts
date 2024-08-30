/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { expandPath } from '../../src';

describe('expandPath', () => {
    describe('wildcard (*)', () => {
        it('should select all shallow paths', () => {
            const obj = {
                foo: ['bar', 'baz'],
            };
            const paths = expandPath(obj, 'foo.*');
            expect(paths).toEqual([
                'foo[0]',
                'foo[1]',
            ]);
        });

        it('should select all shallow paths when path is just the wildcard', () => {
            const obj = ['bar', 'baz'];
            const paths = expandPath(obj, '*');
            expect(paths).toEqual([
                '[0]',
                '[1]',
            ]);
        });

        it('should select key if it is a wildcard', () => {
            const obj = { '*': 'foo' };
            const paths = expandPath(obj, '*');

            expect(paths).toEqual([
                '*',
            ]);
        });

        it('should select matching paths under a wildcard branch', () => {
            const obj = { foo: { bar: { a: true }, baz: { a: false, b: 1 } } };
            const paths = expandPath(obj, 'foo.*.a');
            expect(paths).toEqual([
                'foo.bar.a',
                'foo.baz.a',
            ]);
        });

        it('should expand paths matching multiple wildcards', () => {
            const obj = { foo: { bar: { a: true }, baz: { b: 1 } } };
            const paths = expandPath(obj, 'foo.*.*');

            expect(paths).toEqual([
                'foo.bar.a',
                'foo.baz.b',
            ]);
        });

        it('should not expand path if wildcard position does not exist', () => {
            const obj = { foo: 'bar' };
            const paths = expandPath(obj, 'foo.*.baz');

            expect(paths).toHaveLength(0);
        });
    });

    describe('globstar (**)', () => {
        it('should select all leaves that match a leaf globstar', () => {
            const obj = { foo: { a: { b: { c: 1 } }, d: { e: 2 } } };
            const paths = expandPath(obj, 'foo.**');

            expect(paths).toEqual([
                'foo.a.b.c',
                'foo.d.e',
            ]);
        });

        it('should select deeply nested matching paths under a globstar branch', () => {
            const obj = { foo: { a: { b: { bar: 1 } }, c: { bar: 2 } } };
            const paths = expandPath(obj, 'foo.**.bar');

            expect(paths).toEqual([
                'foo.a.b.bar',
                'foo.c.bar',
            ]);
        });

        it('should select branch and leaf when both match a globstar selector', () => {
            const obj = { foo: { foo: 1 } };
            const paths = expandPath(obj, '**.foo');

            expect(paths).toEqual([
                'foo.foo',
                'foo',
            ]);
        });

        it('should select key if it is a globstar', () => {
            const obj = { '**': 'foo' };
            const paths = expandPath(obj, '**');

            expect(paths).toEqual([
                '**',
            ]);
        });
    });
});
