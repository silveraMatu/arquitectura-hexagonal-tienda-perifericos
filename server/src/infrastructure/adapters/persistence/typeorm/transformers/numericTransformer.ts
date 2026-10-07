import type { ValueTransformer } from "typeorm";

/** The pg driver returns `numeric` columns as strings; this keeps them as JS numbers. */
export const numericTransformer: ValueTransformer = {
  to: (value: number | undefined) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};
