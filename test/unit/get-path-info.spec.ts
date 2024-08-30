/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getPathInfo } from '../../src';

describe('getPathInfo', () => {
    const obj = {
        id: '10702S300W',
        primes: [2, 3, 5, 7, 11],
        dimensions: {
            units: 'mm',
            lengths: [[1.2, 3.5], [2.2, 1.5], [5, 7]],
        },
        'dimensions.lengths': {
            '[2]': [1.2, 3.5],
        },
    };

    it('should handle simple property', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions.units');
        if (info.parent) {
            expect(info.parent.name).toEqual('dimensions');
            expect(info.parent.value).toEqual(obj.dimensions);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(obj.dimensions.units);
        expect(info.exists).toBeTruthy();
        expect(info.name).toEqual('units');
    });

    it('should handle non-existent property', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions.size');
        if (info.parent) {
            expect(info.parent.name).toEqual('dimensions');
            expect(info.parent.value).toEqual(obj.dimensions);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toBeUndefined();
        expect(info.name).toEqual('size');
        expect(info.exists).toBeFalsy();
    });

    it('should handle array index', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'primes[2]');
        if (info.parent) {
            expect(info.parent.name).toEqual('primes');
            expect(info.parent.value).toEqual(obj.primes);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(obj.primes[2]);
        expect(info.name).toEqual('2');
        expect(info.exists).toBeTruthy();
    });

    it('should handle dimensional array', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions.lengths[2][1]');
        if (info.parent) {
            expect(info.parent.name).toEqual('2');
            expect(info.parent.value).toEqual(obj.dimensions.lengths[2]);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(obj.dimensions.lengths[2][1]);
        expect(info.name).toEqual('1');
        expect(info.exists).toBeTruthy();
    });

    it('should handle out of bounds array index', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions.lengths[3]');
        if (info.parent) {
            expect(info.parent.name).toEqual('lengths');
            expect(info.parent.value).toEqual(obj.dimensions.lengths);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(undefined);
        expect(info.name).toEqual('3');
        expect(info.exists).toBeFalsy();
    });

    it('should handle out of bounds dimensional array index', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions.lengths[2][5]');
        if (info.parent) {
            expect(info.parent.name).toEqual('2');
            expect(info.parent.value).toEqual(obj.dimensions.lengths[2]);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(undefined);
        expect(info.name).toEqual('5');
        expect(info.exists).toBeFalsy();
    });

    it('should handle backslash-escaping for .', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions\\.lengths');
        if (info.parent) {
            expect(info.parent.name).toEqual(null);
            expect(info.parent.value).toEqual(obj);
            expect(info.parent.exists).toBeTruthy();
        }
        expect(info.value).toEqual(obj['dimensions.lengths']);
        expect(info.name).toEqual('dimensions.lengths');
        expect(info.exists).toBeTruthy();
    });

    it('should handle backslash-escaping for .[]', () => {
        expect.assertions(6);

        const info = getPathInfo(obj, 'dimensions\\.lengths.\\[2\\][1]');
        if (info.parent) {
            expect(info.parent.name).toEqual('[2]');
            expect(info.parent.value).toEqual(obj['dimensions.lengths']['[2]']);
            expect(info.exists).toBeTruthy();
        }
        expect(info.value).toEqual(obj['dimensions.lengths']['[2]'][1]);
        expect(info.name).toEqual('1');
        expect(info.exists).toBeTruthy();
    });

    it('should not get parent', () => {
        const info = getPathInfo(obj, []);

        expect(info.parent).toEqual(null);
        expect(info.value).toEqual(obj);
        expect(info.name).toEqual(null);
        expect(info.exists).toBeTruthy();
    });
});
