/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    assertType, describe, it,
} from 'vitest';
import type { Path } from '../../src';

describe('path', () => {
    it('should work with simple object', () => {
        const ob = {
            hello: 'universe',
        } as const;

        assertType<Path<typeof ob>>('hello');
    });

    it('should work with simple array', () => {
        const ob = {
            hello: ['universe'],
        } as const;

        assertType<Path<typeof ob>>('hello');
    });

    it('should work with simple nested object', () => {
        const ob = {
            universe: {
                hello: 'world',
            },
        } as const;

        assertType<Path<typeof ob>>('universe');
        assertType<Path<typeof ob>>('universe.hello');
        assertType<Path<typeof ob>>('universe.*');
        assertType<Path<typeof ob>>('universe.**');
        assertType<Path<typeof ob>>('*.hello');
    });

    it('should work with simple object and array value', () => {
        const ob = {
            world: ['hello', 'universe'],
        } as const;

        assertType<Path<typeof ob>>('world');
        assertType<Path<typeof ob>>('world[0]');
        assertType<Path<typeof ob>>('world[1]');
        assertType<Path<typeof ob>>('world.*');
        assertType<Path<typeof ob>>('world.**');
    });

    it('should work with complex object', () => {
        const ob = {
            complex: [
                { hello: 'universe' },
                { universe: 'world' },
                [
                    { hello: 'world' },
                ],
            ],
        } as const;

        assertType<Path<typeof ob>>('complex');
        assertType<Path<typeof ob>>('complex[0]');
        // assertType<Path<typeof ob>>('complex[0].hello');
        assertType<Path<typeof ob>>('complex[1]');
        // assertType<Path<typeof ob>>('complex[1].universe');
        assertType<Path<typeof ob>>('complex.*.universe');
        assertType<Path<typeof ob>>('complex.*');
        assertType<Path<typeof ob>>('complex.**');
        // assertType<Path<typeof ob>>('**.universe');
    });
});
