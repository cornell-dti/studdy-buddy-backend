// An experiment in progressive type checking.

/**
 * Asserts that a 
 * 
 * @param obj
 */
export function isObject(obj: unknown): obj is { [key: string]: unknown } {
    if (typeof obj === "object") {
        if (obj !== null) {
            // @ts-expect-error
            let v: null = obj;
            v = null;

            return true;
        }

        let v: null = obj;
        // @ts-expect-error
        v = {};
    }

    return false;
}

export function has<P extends PropertyKey>(target: object, properties: P[]): target is { [K in P]: unknown } {
    return properties.every(property => property in target);
}

export function hasString<O extends { [key in P]: unknown }, P extends PropertyKey>(target: { [key in P]: unknown }, property: P): target is typeof target & { [K in keyof O]: string } {
    const value = target[property];

    if (typeof value === "string") {
        let v: string = value;
        // @ts-expect-error
        v = 0;

        return true;
    }

    // @ts-expect-error
    let v: string = value;
    v = '';

    return false;
}

export function hasNumber<O extends { [key in P]: unknown }, P extends PropertyKey>(target: O, property: P): target is typeof target & { [K in keyof O]: number } {
    const value = target[property];

    if (typeof value === "number") {
        let v: number = value;
        // @ts-expect-error
        v = false;

        return true;
    }

    // @ts-expect-error
    let v: number = value;
    v = 0;

    return false;
}

export function hasBoolean<O extends { [key in P]: unknown }, P extends PropertyKey>(target: O, property: P): target is typeof target & { [K in keyof O]: number } {
    const value = target[property];

    if (typeof value === "boolean") {
        let v: boolean = value;
        // @ts-expect-error
        v = -1;

        return true;
    }

    // @ts-expect-error
    let v: boolean = value;
    v = false;

    return false;
}