/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { pathToArray } from '../helpers';
import { isObject, isUnsafeKey } from '../utils';

const NUMBER_REGEX = /^\d+$/;

/** Largest value a real array index can take: 2^32 - 2. */
const MAX_ARRAY_INDEX = 4294967294;

/**
 * Whether `key` is a *canonical* array index, per the spec definition: a
 * property key is an array index only when `String(ToUint32(key)) === key`
 * and it is below 2^32 - 1.
 *
 * A digit-only test is not enough. `'01'`, `'007'`, `'4294967295'` and
 * `'99999999999999999999'` all match `/^\d+$/` but are ordinary string
 * properties — assigning them onto an array produces a non-index property,
 * which `JSON.stringify` and `structuredClone` silently discard. Those keys
 * therefore need a plain object, not an array.
 */
function isArrayIndex(key: unknown): boolean {
    const str = typeof key === 'number' ? String(key) : key;

    if (typeof str !== 'string' || !NUMBER_REGEX.test(str)) {
        return false;
    }

    const num = Number(str);

    return num <= MAX_ARRAY_INDEX &&
        String(num) === str;
}

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
        // a canonical array index as the next segment means the slot is
        // about to be indexed, so it has to be an array. Reading the current
        // key instead would build `{ a: { '0': [] } }` for `a[0].b` — an
        // array at the index, with `b` hung off it as a non-index property,
        // which JSON.stringify and structuredClone both discard.
        const existing = temp[key];
        if (!isObject(existing) && !Array.isArray(existing)) {
            // Same "can this be descended into?" test the loop head uses.
            // Covers `undefined` (absent) as well as a pre-existing
            // primitive. Replacing a primitive matches lodash `_.set` and
            // the caller's explicit intent; leaving it in place made the
            // write vanish with no signal.
            (temp as Record<string, any>)[key] = isArrayIndex(parts[index + 1]) ?
                [] :
                {};
        }

        index++;
        temp = temp[key];
    }

    return data;
}
