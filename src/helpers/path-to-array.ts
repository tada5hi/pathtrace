/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isUnsafeKey } from '../utils';

export const BRACKET_NUMBER_REGEX = /(?<!\\)\[(\d+)]$/;

/**
 * Convert string to property path array.
 *
 * @see https://github.com/lodash/lodash/blob/main/src/.internal/stringToPath.ts
 * @see https://github.com/chaijs/pathval
 *
 * @param segment
 */
export function pathToArray(segment: PropertyKey) : PropertyKey[] {
    if (typeof segment === 'number') {
        return [segment];
    }

    if (typeof segment === 'symbol') {
        return [];
    }

    const str = segment.replace(/([^\\])\[/g, '$1.[');
    const parts = str.match(/(\\\.|[^.]+?)+/g);
    if (!parts) {
        return [];
    }

    const result : PropertyKey[] = [];

    for (const part of parts) {
        if (isUnsafeKey(part)) {
            continue;
        }

        const regex = BRACKET_NUMBER_REGEX.exec(part);
        if (regex) {
            result.push(Number(regex[1]));
        } else {
            result.push(part.replace(/\\([.[\]])/g, '$1'));
        }
    }

    return result;
}
