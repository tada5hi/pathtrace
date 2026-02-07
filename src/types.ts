/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type ObjectLiteral = Record<PropertyKey, any>;

type ToWrappedNumber<T> = T extends `[${number}]` ?
    T :
    T extends number | `${number}` ?
            `[${T}]` :
        T;

type FromWrappedNumber<T> = T extends `[${infer U}]` ? U : T;

type PrevIndex = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

type KeyConcat<
    A extends string | number,
    B extends string | number,
> = A extends number | `${number}` | `[${number}]` ?
    (
        B extends number | `${number}` | `[${number}]` ?
        `${ToWrappedNumber<A>}${ToWrappedNumber<B>}` :
         `${ToWrappedNumber<A>}.${B}`
    ) :
    B extends number | `${number}` | `[${number}]` ?
        `${A}${ToWrappedNumber<B>}` :
                `${A}.${B}`;

type EscapeKey<T extends string | number> = T extends `[${number}]` ?
        `\\[${FromWrappedNumber<T>}\\]` :
    T;

type Glob = '*' | '**';
type GlobNext<
    T extends string | number,
    Depth extends number = 4,
> = [Depth] extends [0] ?
    never :
    T extends Glob ?
        never :
        T extends `${Glob}.${infer U}` ?
            U :
            T extends string | number ?
                T :
                never;

// complex , [ hello, universe, hello]
type ArrayPaths<
    K extends string | number,
    P,
> = P extends string | number ?
    (
        KeyConcat<K, number> |
        KeyConcat<K, KeyConcat<number, P>> |
        KeyConcat<'**', GlobNext<P>> |
        K
    ) : never;

type ObjectPaths<
    K extends string | number,
    P,
> = P extends string | number ?
    (
        KeyConcat<K, P> |
        KeyConcat<K, '*'> |
        KeyConcat<K, '**'> |
        KeyConcat<'*', P> |
        KeyConcat<'**', GlobNext<P>> |
        K
    ) : never;

export type Path<
    T,
    Depth extends number = 4,
> = [Depth] extends [0] ?
    never :
    T extends ObjectLiteral ?
        {
            [Key in keyof T & (string | number)]: T[Key] extends (infer U)[] ?
                ArrayPaths<EscapeKey<Key>, Path<U, PrevIndex[Depth]>> :
                T[Key] extends ObjectLiteral ?
                    ObjectPaths<EscapeKey<Key>, Path<T[Key], PrevIndex[Depth]>> :
                    EscapeKey<Key>
        }[keyof T & (string | number)] :
        never;
