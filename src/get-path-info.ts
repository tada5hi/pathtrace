/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PathInfo } from './path-info';

export function getPathInfo(
    data: Record<string, any>,
    path?: string,
) : PathInfo {
    return new PathInfo(data, path);
}
