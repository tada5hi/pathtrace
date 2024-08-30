/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Character } from './constants';
import { isObject } from './utils';
import { arrayToPath, pathToArray } from './helpers';

function expandPathInternal(
    data: Record<string, any>,
    path: string | string[],
    currPath: readonly string[] = [],
): string[] {
    const segments = Array.isArray(path) ? path : pathToArray(path);
    if (!segments.length) {
        // no more paths to traverse
        return [arrayToPath(currPath)];
    }

    const key = segments[0];
    const rest = segments.slice(1);

    if (
        typeof data !== 'undefined' &&
        data !== null &&
        !isObject(data) &&
        !Array.isArray(data)
    ) {
        if (key === Character.GLOBSTAR) {
            if (!rest.length) {
                // globstar leaves are always selected
                return [arrayToPath(currPath)];
            }

            return [];
        }

        if (key === Character.WILDCARD) {
            return [];
        }

        // value is a primitive, paths being traversed from here might be in their prototype,
        // return the entire path
        return [arrayToPath([...currPath, ...segments])];
    }

    // Use a non-null value so that non-existing fields are still selected
    data = data || {};

    if (key === Character.WILDCARD) {
        return Object.keys(data)
            .flatMap((key) => expandPathInternal(data[key], arrayToPath(rest), currPath.concat(key)));
    }

    if (key === Character.GLOBSTAR) {
        return Object.keys(data)
            .flatMap((key) => {
                const nextPath = currPath.concat(key);
                const value = data[key];
                const set = new Set([
                    // recursively find matching sub-paths
                    ...expandPathInternal(value, arrayToPath(segments), nextPath),
                    // skip the first remaining segment, if it matches the current key
                    ...(rest[0] === key ? expandPathInternal(value, arrayToPath(rest.slice(1)), nextPath) : []),
                ]);

                return [...set];
            });
    }

    return expandPathInternal(data[key], rest, currPath.concat(key));
}

/**
 * Expand wildcard and glob patterns to paths.
 *
 * @param data
 * @param path
 */
export function expandPath(
    data: Record<string, any>,
    path: string | string[],
): string[] {
    return expandPathInternal(data, path);
}
