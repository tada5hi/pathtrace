/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from '../helpers';

export function getPathValue(
    data: unknown,
    path: string | string[],
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

        if (parts[index] in Object(temp)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            temp = temp[parts[index]];
        } else {
            break;
        }

        if (index === parts.length - 1) {
            res = temp;
        }

        index++;
    }

    return res;
}
