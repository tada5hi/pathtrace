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
        const info = getPathInfo(obj, 'dimensions.units');
        expect(info.parent).toEqual(obj.dimensions);
        expect(info.value).toEqual(obj.dimensions.units);
        expect(info.name).toEqual('units');
        expect(info.exists).toBeTruthy();
    });

    it('should handle non-existent property', () => {
        const info = getPathInfo(obj, 'dimensions.size');
        expect(info.parent).toEqual(obj.dimensions);
        expect(info.value).toBeUndefined();
        expect(info.name).toEqual('size');
        expect(info.exists).toBeFalsy();
    });

    it('should handle array index', () => {
        const info = getPathInfo(obj, 'primes[2]');
        expect(info.parent).toEqual(obj.primes);
        expect(info.value).toEqual(obj.primes[2]);
        expect(info.name).toEqual('2');
        expect(info.exists).toBeTruthy();
    });

    it('should handle dimensional array', () => {
        const info = getPathInfo(obj, 'dimensions.lengths[2][1]');
        expect(info.parent).toEqual(obj.dimensions.lengths[2]);
        expect(info.value).toEqual(obj.dimensions.lengths[2][1]);
        expect(info.name).toEqual('1');
        expect(info.exists).toBeTruthy();
    });

    it('should handle out of bounds array index', () => {
        const info = getPathInfo(obj, 'dimensions.lengths[3]');
        expect(info.parent).toEqual(obj.dimensions.lengths);
        expect(info.value).toEqual(undefined);
        expect(info.name).toEqual('3');
        expect(info.exists).toBeFalsy();
    });

    it('should handle out of bounds dimensional array index', () => {
        const info = getPathInfo(obj, 'dimensions.lengths[2][5]');
        expect(info.parent).toEqual(obj.dimensions.lengths[2]);
        expect(info.value).toEqual(undefined);
        expect(info.name).toEqual('5');
        expect(info.exists).toBeFalsy();
    });

    it('should handle backslash-escaping for .', () => {
        const info = getPathInfo(obj, 'dimensions\\.lengths');
        expect(info.parent).toEqual(obj);
        expect(info.value).toEqual(obj['dimensions.lengths']);
        expect(info.name).toEqual('dimensions.lengths');
        expect(info.exists).toBeTruthy();
    });

    it('should handle backslash-escaping for .[]', () => {
        const info = getPathInfo(obj, 'dimensions\\.lengths.\\[2\\][1]');
        expect(info.parent).toEqual(obj['dimensions.lengths']['[2]']);
        expect(info.value).toEqual(obj['dimensions.lengths']['[2]'][1]);
        expect(info.name).toEqual('1');
        expect(info.exists).toBeTruthy();
    });
});
