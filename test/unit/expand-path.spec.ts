/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ExpandedPath } from '../../src';
import { expandPath, expandPathVerbose } from '../../src';

describe('expandPath', () => {
    describe('wildcard (*)', () => {
        it('should select all shallow paths', () => {
            const obj = {
                foo: ['bar', 'baz'],
            };
            const paths = expandPathVerbose(obj, 'foo.*');
            expect(paths).toEqual([
                { value: 'foo[0]', matches: ['0'] },
                { value: 'foo[1]', matches: ['1'] },
            ] satisfies ExpandedPath[]);
        });

        it('should select all shallow paths (simple)', () => {
            const obj = {
                foo: ['bar', 'baz'],
            };
            const paths = expandPath(obj, 'foo.*');
            expect(paths).toEqual(['foo[0]', 'foo[1]']);
        });

        it('should select all shallow paths when path is just the wildcard', () => {
            const obj = ['bar', 'baz'];
            const paths = expandPathVerbose(obj, '*');
            expect(paths).toEqual([
                { value: '[0]', matches: ['0'] },
                { value: '[1]', matches: ['1'] },
            ] satisfies ExpandedPath[]);
        });

        it('should select key if it is a wildcard', () => {
            const obj = { '*': 'foo' };
            const paths = expandPathVerbose(obj, '*');

            expect(paths).toEqual([
                { value: '*', matches: ['*'] },
            ] satisfies ExpandedPath[]);
        });

        it('should select matching paths under a wildcard branch', () => {
            const obj = { foo: { bar: { a: true }, baz: { a: false, b: 1 } } };
            const paths = expandPathVerbose(obj, 'foo.*.a');
            expect(paths).toEqual([
                { value: 'foo.bar.a', matches: ['bar'] },
                { value: 'foo.baz.a', matches: ['baz'] },
            ] satisfies ExpandedPath[]);
        });

        it('should expand paths matching multiple wildcards', () => {
            const obj = { foo: { bar: { a: true }, baz: { b: 1 } } };
            const paths = expandPathVerbose(obj, 'foo.*.*');

            expect(paths).toEqual([
                { value: 'foo.bar.a', matches: ['bar', 'a'] },
                { value: 'foo.baz.b', matches: ['baz', 'b'] },
            ] satisfies ExpandedPath[]);
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
            const paths = expandPathVerbose(obj, 'foo.**');

            expect(paths).toEqual([
                { value: 'foo.a.b.c', matches: [['a', 'b', 'c']] },
                { value: 'foo.d.e', matches: [['d', 'e']] },
            ] satisfies ExpandedPath[]);
        });

        it('should select deeply nested matching paths under a globstar branch', () => {
            const obj = { foo: { a: { b: { bar: 1 } }, c: { bar: 2 } } };
            const paths = expandPathVerbose(obj, 'foo.**.bar');

            expect(paths).toEqual([
                { value: 'foo.a.b.bar', matches: [['a', 'b']] },
                { value: 'foo.c.bar', matches: [['c']] },
            ] satisfies ExpandedPath[]);
        });

        it('should select branch and leaf when both match a globstar selector', () => {
            const obj = { foo: { foo: 1 } };
            const paths = expandPathVerbose(obj, '**.foo');

            expect(paths).toEqual([
                { value: 'foo.foo', matches: [['foo']] },
                { value: 'foo', matches: [] },
            ] satisfies ExpandedPath[]);
        });

        it('should select key if it is a globstar', () => {
            const obj = { '**': 'foo' };
            const paths = expandPathVerbose(obj, '**');

            expect(paths).toEqual([
                { value: '**', matches: [['**']] },
            ] satisfies ExpandedPath[]);
        });
    });
});
