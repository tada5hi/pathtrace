/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from '../helpers';
import { hasOwnEntry } from '../utils';

export function getPathValue(
    data: unknown,
    path: PropertyKey | PropertyKey[],
): unknown {
    const parts = Array.isArray(path) ?
        path :
        pathToArray(path);

    let res : unknown | undefined;
    let temp = data;
    let index = 0;
    while (index < parts.length) {
        if (temp === null || typeof temp === 'undefined') {
            break;
        }

        const part = parts[index] as PropertyKey;

        // Own, safe entries only — an unsafe segment or an inherited member
        // ends the traversal instead of resolving to something else.
        if (!hasOwnEntry(temp, part)) {
            break;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        temp = temp[part];

        if (index === parts.length - 1) {
            res = temp;
        }

        index++;
    }

    return res;
}
