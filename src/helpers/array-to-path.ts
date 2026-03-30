/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * @see https://github.com/express-validator/express-validator/blob/bec1dcbaa29002dcd21093ec84818c4671063b5d/src/field-selection.ts#L214
 * @param parts
 */
export function arrayToPath(parts: readonly PropertyKey[]) : string {
    let output = '';

    for (let part of parts) {
        let current = '';

        if (typeof part === 'string') {
            part = part.replace(/^\[(\d+)]$/g, '\\[$1]');
            part = part.replace(/\./g, '\\.');

            if (/^\d+$/.test(part)) {
                // Index access
                current = `[${part}]`;
            } else if (output) {
                // Object key access
                current = `.${part}`;
            } else {
                // Top level key
                current = part;
            }
        } else if (typeof part === 'number') {
            current = `[${part}]`;
        }

        output += current;
    }

    return output;
}
