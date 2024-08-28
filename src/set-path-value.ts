/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from './helpers';
import { isObject } from './utils';

const NUMBER_REGEX = /^\d+$/;

export function setPathValue(
    data: Record<string, any> | Record<string, any>[],
    path: string | string[],
    value: unknown,
) {
    const parts = Array.isArray(path) ? path : pathToArray(path);

    let temp = data;
    let index = 0;
    while (index < parts.length) {
        /* istanbul ignore next */
        if (!Array.isArray(temp) && !isObject(temp)) {
            break;
        }

        const key = parts[index] as keyof typeof temp;

        // [foo, '0']
        if (typeof temp[key] === 'undefined') {
            const match = NUMBER_REGEX.test(key);
            if (match) {
                (temp as Record<string, any>)[key] = [];
            } else {
                temp[key] = {};
            }
        }

        if (index === parts.length - 1) {
            temp[key] = value;
            break;
        }

        index++;
        temp = temp[key];
    }

    return data;
}
