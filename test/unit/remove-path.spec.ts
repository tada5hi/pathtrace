/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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

        expect(object.universe).toEqual({
            hello: 'world',
        });
        expect(object.world).toEqual(['hello']);
    });

    it('should not remove non existent path', () => {
        const object = {
            hello: 'universe',
        };

        removePath(object, 'foo.bar');

        expect(object).toEqual(object);
    });
});
