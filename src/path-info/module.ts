/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getPathValue } from '../path-value';
import { pathToArray } from '../helpers';
import { hasOwnEntry } from '../utils';

export class PathInfo {
    protected data: unknown;

    protected pathParts: PropertyKey[];

    protected _value: unknown;

    protected _parent: PathInfo | null | undefined;

    protected _exists: boolean | undefined;

    constructor(data: unknown, path: PropertyKey | PropertyKey[]) {
        this.data = data;

        // Unsafe segments are kept, not filtered: dropping them would shorten
        // the path and describe a different — possibly empty — one, which is
        // why `getPathInfo(data, '__proto__')` used to report the whole object
        // as an existing value. They are rejected by `exists`/`value` instead.
        if (Array.isArray(path)) {
            this.pathParts = [...path];
        } else {
            this.pathParts = pathToArray(path);
        }
    }

    get value() {
        if (typeof this._value !== 'undefined') {
            return this._value;
        }

        if (this.pathParts.length > 0) {
            this._value = getPathValue(this.data, this.pathParts);
        } else {
            this._value = this.data;
        }

        return this._value;
    }

    get name() : PropertyKey | null {
        if (this.pathParts.length > 0) {
            return this.pathParts[this.pathParts.length - 1];
        }

        return null;
    }

    get parent() : PathInfo | null {
        if (typeof this._parent !== 'undefined') {
            return this._parent;
        }

        if (this.pathParts.length === 0) {
            this._parent = null;
            return this._parent;
        }

        if (this.pathParts.length > 1) {
            this._parent = new PathInfo(
                this.data,
                this.pathParts.slice(0, this.pathParts.length - 1),
            );
        } else {
            this._parent = new PathInfo(this.data, []);
        }

        return this._parent;
    }

    get exists() : boolean {
        if (typeof this._exists !== 'undefined') {
            return this._exists;
        }

        if (!this.name || !this.parent) {
            this._exists = true;
            return this._exists;
        }

        // Own, safe entries only — inherited members (`toString`, `valueOf`, …)
        // are not data and must not be reported as existing paths.
        this._exists = hasOwnEntry(this.parent.value, this.name);

        return this._exists;
    }
}
