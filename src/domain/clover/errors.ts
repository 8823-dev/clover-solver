export class CloverHintValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloverHintValidationError";
  }
}

