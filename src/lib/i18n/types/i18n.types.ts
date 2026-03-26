declare const messageTokenBrand: unique symbol;

export type MessageToken = string & {
  readonly [messageTokenBrand]: true;
};

export type MessageParams = Record<string, string | number>;

export interface NestedMessageCatalog {
  [key: string]: string | NestedMessageCatalog;
}

export type FlatMessageCatalog = Record<string, string>;

export type TokenTree<T> = T extends string
  ? MessageToken
  : {
      readonly [K in keyof T]: TokenTree<T[K]>;
    };
