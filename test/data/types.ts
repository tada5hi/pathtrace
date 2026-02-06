/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { Path } from '../../src';

const ob = {
    hello: 'universe',
    universe: {
        hello: 'world',
    },
    world: ['hello', 'universe'],
    complex: [{ hello: 'universe' }, { universe: 'world' }, [{ hello: 'world' }]],
} as const;

type MyPath = Path<typeof ob>;
const paths : MyPath[] = [
    'hello',
    'universe.*',
    '*.hello',
    'world[0]',
    'world[2]',
    'complex[0]',
    'complex.*.universe',
    'complex.**',
    'complex[1].universe',
    'complex[0].hello',
    '**.universe',
];

console.log(paths);
