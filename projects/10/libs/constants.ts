export const SYMBOLS = /(\{|\}|\"|\(|\)|\[|\]|\.|\,|\;|\+|\-|\*|\/|\&|\,|\<|\>|\=|\~|\|)/;

export const KEYWORDS = /(class|constructor|function|method|field|static|var|int|char|boolean|void|true|false|null|this|let|do|if|else|while|return)$/;

export const TYPE_KEYWORD = "keyword" as const;
export const TYPE_SYMBOL = "symbol" as const;
export const TYPE_IDENTIFER = "identifier" as const;
export const TYPE_INT_CONST = "integerConstant" as const;
export const TYPE_STRING_CONST = "stringConstant" as const;

export const KEYWORD_CLASS = "class" as const;
