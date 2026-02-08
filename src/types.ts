/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type ObjectLiteral = Record<PropertyKey, any>;

type ToWrappedNumber<T> = T extends `[${number}]` ?
    T :
    T extends number ?
            `[${T}]` :
        T;

type PrevIndex = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

type KeyConcat<
    A extends string | number,
    B extends string | number,
> = A extends number | `[${number}]` ?
    (
        B extends number | `[${number}]` ?
        `${ToWrappedNumber<A>}${ToWrappedNumber<B>}` :
         `${ToWrappedNumber<A>}.${B}`
    ) :
    B extends number | `[${number}]` ?
        `${A}${ToWrappedNumber<B>}` :
                `${A}.${B}`;

type EscapeKey<T extends string | number> = T extends `[${infer U}]` ?
        `\\[${U}\\]` :
    T;

type Glob = '*' | '**';
type GlobNext<
    T extends string | number,
    Depth extends number = 4,
> = [Depth] extends [0] ?
    never :
    T extends `${Glob}.${infer U}` ?
        T | U :
        T;

type PathNormalize<T> = T extends `${infer A}.[${infer B}].${infer C}` ? `${A}[${B}].${C}` : T;

type PathVariants<
    K extends string | number,
    P,
> = P extends string | number ?
    (
        PathNormalize<
        K |
        KeyConcat<K, P> |
        KeyConcat<K, '*'> |
        KeyConcat<K, '**'> |
        KeyConcat<'*', P> |
        KeyConcat<'**', GlobNext<P>>
        >
    ) : never;

export type Path<
    T,
    Depth extends number = 4,
> = [Depth] extends [0] ?
    never :
    T extends ObjectLiteral ?
        {
            [Key in keyof T & (string | number)]: T[Key] extends (infer U)[] ?
                EscapeKey<Key> |
                PathVariants<
                EscapeKey<Key>,
                Path<U, PrevIndex[Depth]>
                > :
                T[Key] extends ObjectLiteral ?
                    EscapeKey<Key> |
                    PathVariants<
                    EscapeKey<Key>,
                    Path<T[Key], PrevIndex[Depth]>
                    > :
                    EscapeKey<Key>
        }[keyof T & (string | number)] :
        never;
