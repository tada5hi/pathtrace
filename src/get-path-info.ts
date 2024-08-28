/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getPathValue } from './get-path-value';
import type { PathInfo } from './types';
import { pathToArray } from './helpers';

export function getPathInfo(
    data: Record<string, any>,
    path: string,
) : PathInfo {
    const parts = pathToArray(path);
    /* istanbul ignore next */
    if (parts.length === 0) {
        throw new SyntaxError(`The path ${path} is not valid.`);
    }

    const info : PathInfo = {
        parent: parts.length > 1 ?
            getPathValue(data, parts.slice(0, parts.length - 1)) :
            data,
        name: parts[parts.length - 1],
        value: getPathValue(data, parts),
        exists: false,
    };

    if (
        info.parent !== null &&
        typeof info.parent !== 'undefined'
    ) {
        info.exists = info.name in Object(info.parent);
    }

    return info;
}
