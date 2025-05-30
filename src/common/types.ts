// src/common/types.ts

export type Operator =
  | '='
  | 'like'
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'between'
  | 'date';

export interface FilterConfig {
  [field: string]: Operator;
}

export interface QueryConfig {
  filters: FilterConfig;
  orderableFields: string[];
}
