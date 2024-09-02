/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Character } from './constants';
import type { ExpandedPath } from './types';
import { isObject } from '../utils';
import { arrayToPath, pathToArray } from '../helpers';

function expandPathVerboseInternal(
    data: Record<string, any>,
    path: string | string[],
    currPath: readonly string[] = [],
    currMatches: readonly (string | string[])[] = [],
): ExpandedPath[] {
    const segments = Array.isArray(path) ? path : pathToArray(path);
    if (!segments.length) {
        // no more paths to traverse
        return [
            {
                value: arrayToPath(currPath),
                matches: currMatches,
            },
        ];
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
                return [
                    {
                        value: arrayToPath(currPath),
                        matches: currMatches,
                    },
                ];
            }

            return [];
        }

        if (key === Character.WILDCARD) {
            return [];
        }

        // value is a primitive, paths being traversed from here might be in their prototype,
        // return the entire path
        return [{ value: arrayToPath([...currPath, ...segments]), matches: currMatches }];
    }

    // Use a non-null value so that non-existing fields are still selected
    data = data || {};

    if (key === Character.WILDCARD) {
        return Object.keys(data)
            .flatMap((key) => expandPathVerboseInternal(
                data[key],
                arrayToPath(rest),
                currPath.concat(key),
                currMatches.concat(key),
            ));
    }

    if (key === Character.GLOBSTAR) {
        return Object.keys(data)
            .flatMap((key) => {
                const nextPath = currPath.concat(key);
                const value = data[key];

                // recursively find matching sub-paths & skip the first remaining segment, if it matches the current key
                const children = expandPathVerboseInternal(value, arrayToPath(segments), nextPath, [key])
                    .concat(rest[0] === key ? expandPathVerboseInternal(value, arrayToPath(rest.slice(1)), nextPath, []) : []);

                const pathMatches : string[] = [];
                const output : ExpandedPath[] = [];
                for (let i = 0; i < children.length; i++) {
                    /* istanbul ignore next */
                    if (pathMatches.indexOf(children[i].value) !== -1) {
                        continue;
                    }

                    pathMatches.push(children[i].value);

                    output.push({
                        value: children[i].value,
                        matches: children[i].matches.length > 0 ?
                            [...currMatches, children[i].matches.flat()] :
                            currMatches,
                    });
                }

                return output;
            });
    }

    return expandPathVerboseInternal(data[key], rest, currPath.concat(key), currMatches);
}

/**
 * Verbose expand wildcard and glob patterns.
 * Track wildcard/glob pattern matches.
 *
 * @param data
 * @param path
 */
export function expandPathVerbose(
    data: Record<string, any>,
    path: string | string[],
): ExpandedPath[] {
    return expandPathVerboseInternal(data, path);
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
    return expandPathVerbose(data, path)
        .map((el) => el.value);
}
