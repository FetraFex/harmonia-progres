declare module "@hookform/resolvers/zod" {
  import type { Resolver } from "react-hook-form";
  import type { ZodSchema } from "zod";

  export function zodResolver<T extends Record<string, unknown>>(
    schema: ZodSchema<T>,
  ): Resolver<T>;
}
