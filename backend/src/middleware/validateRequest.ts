import { type Request, type Response, type NextFunction } from "express"
import { ZodError, type ZodSchema } from "zod"

export const validateRequest =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                console.log(req);
                req.body = schema.parse(req.body)
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation failed",
                        errors: error.issues.map((issue) => ({
                            field: issue.path.join("."),
                            message: issue.message,
                        })),
                    })
                    return
                }

                next(error)
            }
        }
