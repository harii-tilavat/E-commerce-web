type FieldError = { field: string; message: string };

class ApiError extends Error {
  statusCode: number;
  errors: FieldError[];
  success = false;

  constructor(statusCode: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ApiError;
