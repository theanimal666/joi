import AnySchema from "../any";

export default interface SymbolSchema extends AnySchema {
    // TODO: support number and symbol index
    map(iterable: Iterable<[string | number | boolean | symbol, symbol]> | { [key: string]: symbol }): this;
}
