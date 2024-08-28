/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getPathValue } from '../../src';

describe('getPathValue', () => {
    it('returns the correct value', () => {
        const object = {
            hello: 'universe',
            universe: {
                hello: 'world',
            },
            world: ['hello', 'universe'],
            complex: [{ hello: 'universe' }, { universe: 'world' }, [{ hello: 'world' }]],
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
