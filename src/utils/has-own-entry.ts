/*
 * Copyright (c) 2024-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isUnsafeKey } from './is-unsafe-key';

/**
 * Check if a key is an own, safe entry of the target.
 *
 * Uses `Object.hasOwn` rather than `in`, so inherited members (`toString`,
 * `valueOf`, `hasOwnProperty`, …) never resolve as data. Own properties of
 * boxed primitives are unaffected, so `'word'.length` keeps working.
 *
 * @param target
 * @param key
 */
export function hasOwnEntry(target: unknown, key: PropertyKey) : boolean {
    if (isUnsafeKey(key)) {
        return false;
    }

    if (
        target === null ||
        typeof target === 'undefined'
    ) {
        return false;
    }

    return Object.hasOwn(Object(target), key);
}
