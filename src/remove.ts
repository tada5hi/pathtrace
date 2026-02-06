/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from './helpers';
import { isObject } from './utils';

export function removePath(
    data: Record<string, any> | Record<string, any>[],
    path: string | string[],
) {
    const parts = Array.isArray(path) ?
        path :
        pathToArray(path);

    let temp = data;
    let index = 0;
    while (index < parts.length) {
        /* istanbul ignore next */
        if (!Array.isArray(temp) && !isObject(temp)) {
            break;
        }

        const key = parts[index] as keyof typeof temp;

        if (!Object.prototype.hasOwnProperty.call(temp, key)) {
            break;
        }

        if (index === parts.length - 1) {
            if (Array.isArray(temp)) {
                const tempKey = Number(key);
                if (!Number.isNaN(tempKey)) {
                    temp.splice(tempKey, 1);
                    break;
                }
            }

            delete temp[key];
            break;
        }

        index++;
        temp = temp[key];
    }
}
