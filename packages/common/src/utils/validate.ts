import { z } from 'zod'

export function validateSchema<T extends z.ZodSchema>(
    data: any,
    schema: T,
    throwOnError?: boolean
) {
    const validation = schema.safeParse(data)
    if (!validation.success) {
        if (throwOnError) {
            throw new Error(JSON.stringify(validation.error))
        }
        return { error: validation.error } as { error: z.ZodError }
    }
    return { data: validation.data } as { data: z.infer<T> }
}
