/*
 * Copyright (c) 2024-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isUnsafeKey } from './is-unsafe-key';

/**
 * Check if a key is a safe, readable entry of the target.
 *
 * Three rules, in order:
 *
 * 1. An **own** property always resolves — including one that shadows an
 *    inherited name, and `length` on a boxed `String`/`Array`.
 * 2. A name that **every** object inherits never resolves. Those are exactly
 *    the own keys of `Object.prototype` (`toString`, `valueOf`,
 *    `hasOwnProperty`, …) — a set fixed by the language, so there is no list to
 *    keep up to date, and it holds for objects from another realm too, where
 *    comparing prototype identity would not.
 * 3. Anything else inherited resolves. A getter on a class prototype is data as
 *    far as a caller is concerned and is indistinguishable from a plain field
 *    at the call site.
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

    const source = Object(target);

    if (Object.hasOwn(source, key)) {
        return true;
    }

    if (Object.hasOwn(Object.prototype, key)) {
        return false;
    }

    return key in source;
}
