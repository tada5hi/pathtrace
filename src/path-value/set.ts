/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from '../helpers';
import { isObject, isUnsafeKey } from '../utils';

const NUMBER_REGEX = /^\d+$/;

export function setPathValue(
    data: Record<string, any> | Record<string, any>[],
    path: string | string[],
    value: unknown,
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

        if (isUnsafeKey(key)) {
            break;
        }

        if (index === parts.length - 1) {
            temp[key] = value;
            break;
        }

        // Materialize the intermediate this key points at.
        //
        // The container kind is decided by the *next* segment, not this one:
        // a numeric next segment means the slot is about to be indexed
        // numerically, so it has to be an array. Reading the current key
        // instead would build `{ a: { '0': [] } }` for `a[0].b` — an array
        // at the index, with `b` hung off it as a non-index property, which
        // JSON.stringify and structuredClone both discard.
        const existing = temp[key];
        if (!isObject(existing) && !Array.isArray(existing)) {
            // Same "can this be descended into?" test the loop head uses.
            // Covers `undefined` (absent) as well as a pre-existing
            // primitive. Replacing a primitive matches lodash `_.set` and
            // the caller's explicit intent; leaving it in place made the
            // write vanish with no signal.
            (temp as Record<string, any>)[key] = NUMBER_REGEX.test(parts[index + 1] as string) ?
                [] :
                {};
        }

        index++;
        temp = temp[key];
    }

    return data;
}
