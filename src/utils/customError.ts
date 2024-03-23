export class CustomError extends Error {
  statusCode: number
  errors: string[] = []
  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message)
    this.statusCode = statusCode
    if (errors) this.errors = errors
  }
}
