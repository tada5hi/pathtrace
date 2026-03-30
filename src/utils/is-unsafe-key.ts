/*
 * Copyright (c) 2024-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

const UNSAFE_KEYS = new Set<PropertyKey>(['__proto__', 'constructor', 'prototype']);

export function isUnsafeKey(key: PropertyKey): boolean {
    return UNSAFE_KEYS.has(key);
}
