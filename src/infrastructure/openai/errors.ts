export class OpenAIConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIConfigurationError";
  }
}

export class OpenAIRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OpenAIRequestError";
  }
}

export class OpenAIResponseParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIResponseParseError";
  }
}

