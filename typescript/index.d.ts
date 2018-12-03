// Type definitions for joi 14.0
// Project: https://github.com/hapijs/joi
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
//                 Laurence Dougal Myers <https://github.com/laurence-myers>
//                 Christopher Glantschnig <https://github.com/cglantschnig>
//                 David Broder-Rodgers <https://github.com/DavidBR-SW>
//                 Gael Magnan de Bornier <https://github.com/GaelMagnan>
//                 Rytis Alekna <https://github.com/ralekna>
//                 Pavel Ivanov <https://github.com/schfkt>
//                 Youngrok Kim <https://github.com/rokoroku>
//                 Dan Kraus <https://github.com/dankraus>
//                 Anjun Wang <https://github.com/wanganjun>
//                 Rafael Kallis <https://github.com/rafaelkallis>
//                 Conan Lai <https://github.com/aconanlai>
//                 Peter Thorson <https://github.com/zaphoyd>
//                 Will Garcia <https://github.com/thewillg>
//                 Simon Schick <https://github.com/SimonSchick>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

// TODO express type of Schema in a type-parameter (.default, .valid, .example etc)

import {ValidationResult} from "./types/any/validation-result";
import {Context, ValidationError} from "./types/any/validation-error";

import AnySchema from "./types/any";
import AlternativesSchema from "./types/alternatives";
import ArraySchema from "./types/array";
import BinarySchema from "./types/binary";
import BooleanSchema from "./types/boolean";
import DateSchema from "./types/date/date";
import FunctionSchema from "./types/function";
import LazySchema from "./types/lazy";
import NumberSchema from "./types/number";
import ObjectSchema from "./types/object";
import StringSchema from "./types/string";
import SymbolSchema from "./types/symbol";

import Reference, {ReferenceOptions} from "./ref";
import {LazyOptions} from "./types/lazy/options";

export type Types =
    'any'
    | 'alternatives'
    | 'array'
    | 'boolean'
    | 'binary'
    | 'date'
    | 'function'
    | 'lazy'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol';

export type LanguageOptions = string | boolean | null | {
    [key: string]: LanguageOptions;
};

export type LanguageRootOptions = {
    root?: string;
    key?: string;
    messages?: { wrapArrays?: boolean; };
} & Partial<Record<Types, LanguageOptions>> & { [key: string]: LanguageOptions; };

export interface ValidationOptions {
    /**
     * when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
     */
    abortEarly?: boolean;
    /**
     * when true, attempts to cast values to the required types (e.g. a string to a number). Defaults to true.
     */
    convert?: boolean;
    /**
     * when true, allows object to contain unknown keys which are ignored. Defaults to false.
     */
    allowUnknown?: boolean;
    /**
     * when true, ignores unknown keys with a function value. Defaults to false.
     */
    skipFunctions?: boolean;
    /**
     * remove unknown elements from objects and arrays. Defaults to false
     * - when true, all unknown elements will be removed
     * - when an object:
     *      - objects - set to true to remove unknown keys from objects
     */
    stripUnknown?: boolean | { arrays?: boolean; objects?: boolean };
    /**
     * overrides individual error messages. Defaults to no override ({}).
     */
    language?: LanguageRootOptions;
    /**
     * sets the default presence requirements. Supported modes: 'optional', 'required', and 'forbidden'. Defaults to 'optional'.
     */
    presence?: 'optional' | 'required' | 'forbidden';
    /**
     * provides an external data set to be used in references
     */
    context?: Context;
    /**
     * when true, do not apply default values. Defaults to false.
     */
    noDefaults?: boolean;
}

export type SchemaLike = string | number | boolean | object | null | RegExp | Schema | SchemaMap;

export interface SchemaMap {
    [key: string]: SchemaLike | SchemaLike[];
}

export type Schema = AnySchema
    | ArraySchema
    | AlternativesSchema
    | BinarySchema
    | BooleanSchema
    | DateSchema
    | FunctionSchema
    | NumberSchema
    | ObjectSchema
    | StringSchema
    | LazySchema;

export interface Description {
    type?: Types | string;
    label?: string;
    description?: string;
    flags?: object;
    notes?: string[];
    tags?: string[];
    meta?: any[];
    example?: any[];
    valids?: any[];
    invalids?: any[];
    unit?: string;
    options?: ValidationOptions;

    [key: string]: any;
}

export interface State {
    key?: string;
    path?: Array<string | number>;
    parent?: any;
    reference?: any;
}

export type ExtensionBoundSchema = Schema & {
    /**
     * Creates a joi error object.
     * Used in conjunction with custom rules.
     * @param type - the type of rule to create the error for.
     * @param context - provide properties that will be available in the `language` templates.
     * @param state - should the context passed into the `validate` function in a custom rule
     * @param options - should the context passed into the `validate` function in a custom rule
     */
    createError(type: string, context: Context, state: State, options: ValidationOptions): Err;
};

export interface Rules<P extends object = any> {
    name: string;
    params?: ObjectSchema | { [key in keyof P]: SchemaLike; };

    setup?(this: ExtensionBoundSchema, params: P): Schema | void;

    validate?(this: ExtensionBoundSchema, params: P, value: any, state: State, options: ValidationOptions): any;

    description?: string | ((params: P) => string);
}

export interface Extension {
    name: string;
    base?: Schema;
    language?: LanguageOptions;

    coerce?(this: ExtensionBoundSchema, value: any, state: State, options: ValidationOptions): any;

    pre?(this: ExtensionBoundSchema, value: any, state: State, options: ValidationOptions): any;

    describe?(this: Schema, description: Description): Description;

    rules?: Rules[];
}

export interface Err {
    isJoi: boolean;

    toString(): string;
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

export default interface Joi extends AnySchema {

    /**
     * Current version of the joi package.
     */
    version: string;

    /**
     * Generates a schema object that matches any data type.
     */
    any(): AnySchema;

    /**
     * Generates a schema object that matches an array data type.
     */
    array(): ArraySchema;

    /**
     * Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', and 'no'). Can also be called via bool().
     */
    bool(): BooleanSchema;

    boolean(): BooleanSchema;

    /**
     * Generates a schema object that matches a Buffer data type (as well as the strings which will be converted to Buffers).
     */
    binary(): BinarySchema;

    /**
     * Generates a schema object that matches a date type (as well as a JavaScript date string or number of milliseconds).
     */
    date(): DateSchema;

    /**
     * Generates a schema object that matches a function type.
     */
    func(): FunctionSchema;

    /**
     * Generates a schema object that matches a number data type (as well as strings that can be converted to numbers).
     */
    number(): NumberSchema;

    /**
     * Generates a schema object that matches an object data type (as well as JSON strings that have been parsed into objects).
     */
    object(schema?: SchemaMap): ObjectSchema;

    /**
     * Generates a schema object that matches a string data type. Note that empty strings are not allowed by default and must be enabled with allow('').
     */
    string(): StringSchema;

    /**
     * Generates a schema object that matches any symbol.
     */
    symbol(): SymbolSchema;

    /**
     * Generates a type that will match one of the provided alternative schemas
     */
    alternatives(types: SchemaLike[]): AlternativesSchema;

    alternatives(...types: SchemaLike[]): AlternativesSchema;

    /**
     * Alias for `alternatives`
     */
    alt(types: SchemaLike[]): AlternativesSchema;

    alt(...types: SchemaLike[]): AlternativesSchema;

    /**
     * Generates a placeholder schema for a schema that you would provide with the fn.
     * Supports the same methods of the any() type.
     * This is mostly useful for recursive schemas
     */
    lazy(cb: () => Schema, options?: LazyOptions): LazySchema;

    /**
     * Validates a value using the given schema and options.
     */
    validate<T>(value: T, schema: SchemaLike, options?: ValidationOptions): ValidationResult<T>;

    validate<T, R>(value: T, schema: SchemaLike, callback: (err: ValidationError, value: T) => R): R;

    validate<T, R>(value: T, schema: SchemaLike, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): R;

    /**
     * Converts literal schema definition to joi schema object (or returns the same back if already a joi schema object).
     */
    compile(schema: SchemaLike): Schema;

    /**
     * Validates a value against a schema and throws if validation fails.
     *
     * @param value - the value to validate.
     * @param schema - the schema object.
     * @param message - optional message string prefix added in front of the error message. may also be an Error object.
     */
    assert(value: any, schema: SchemaLike, message?: string | Error): void;

    /**
     * Validates a value against a schema, returns valid object, and throws if validation fails where:
     *
     * @param value - the value to validate.
     * @param schema - the schema object.
     * @param message - optional message string prefix added in front of the error message. may also be an Error object.
     */
    attempt<T>(value: T, schema: SchemaLike, message?: string | Error): T;

    /**
     * Generates a reference to the value of the named key.
     */
    ref(key: string, options?: ReferenceOptions): Reference;

    /**
     * Checks whether or not the provided argument is a reference. It's especially useful if you want to post-process error messages.
     */
    isRef(ref: any): ref is Reference;

    /**
     * Get a sub-schema of an existing schema based on a `path` that can be either a string or an array
     * of strings For string values path separator is a dot (`.`)
     */
    reach(schema: ObjectSchema, path: string | string[]): Schema;

    /**
     * Creates a new Joi instance customized with the extension(s) you provide included.
     */
    extend(extension: Extension | Extension[], ...extensions: Array<Extension | Extension[]>): any;

    /**
     * Creates a new Joi instance that will apply defaults onto newly created schemas
     * through the use of the fn function that takes exactly one argument, the schema being created.
     *
     * @param fn - The function must always return a schema, even if untransformed.
     */
    defaults(fn: (root: Schema) => Schema): Joi;
}
