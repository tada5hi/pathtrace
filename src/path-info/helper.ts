/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PathInfo } from './module';

// `unknown`, not `Record<string, any>`: primitives are valid input — their own
// properties (`'word'.length`) resolve, in line with `PathInfo`/`getPathValue`.
export function getPathInfo(
    data: unknown,
    path: PropertyKey | PropertyKey[],
) : PathInfo {
    return new PathInfo(data, path);
}
