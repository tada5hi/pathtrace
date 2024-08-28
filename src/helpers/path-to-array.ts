/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export const BRACKET_NUMBER_REGEX = /^\[(\d+)]$/;

/**
 * Convert string to property path array.
 *
 * @see https://github.com/lodash/lodash/blob/main/src/.internal/stringToPath.ts
 * @see https://github.com/chaijs/pathval
 *
 * @param segment
 */
export function pathToArray(segment: string) : string[] {
    const str = segment.replace(/([^\\])\[/g, '$1.[');
    const parts = str.match(/(\\\.|[^.]+?)+/g);
    if (!parts) {
        return [];
    }

    const result : string[] = [];

    for (let i = 0; i < parts.length; i++) {
        if (
            parts[i] === 'constructor' ||
            parts[i] === '__proto__' ||
            parts[i] === 'prototype'
        ) {
            continue;
        }

        const regex = BRACKET_NUMBER_REGEX.exec(parts[i]);
        if (regex) {
            result.push(regex[1]);
        } else {
            result.push(parts[i].replace(/\\([.[\]])/g, '$1'));
        }
    }

    return result;
}
