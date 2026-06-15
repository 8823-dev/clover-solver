import type {
  CloverHintGenerationRequest,
  CloverHintGenerationResult,
  CloverHintGenerator,
} from "@/application/ports/CloverHintGenerator";
import {
  OpenAIConfigurationError,
  OpenAIRequestError,
  OpenAIResponseParseError,
} from "./errors";
import {
  buildCloverHintPrompt,
  cloverHintDeveloperMessage,
} from "./prompt";
import { parseCloverHintsFromOpenAIResponse } from "./response";
import { cloverHintsJsonSchema } from "./schema";

const openAIResponsesEndpoint = "https://api.openai.com/v1/responses";
const defaultOpenAIModel = "gpt-4.1-mini";

type OpenAICloverHintGeneratorConfig = {
  readonly apiKey: string;
  readonly model?: string;
  readonly endpoint?: string;
  readonly fetcher?: typeof fetch;
};

export const createOpenAICloverHintGeneratorFromEnv = (
  env: NodeJS.ProcessEnv = process.env,
): OpenAICloverHintGenerator => {
  // API key は server 側の環境変数からのみ読み取り、呼び出し元へ露出させない。
  const apiKey = env.OPENAI_API_KEY?.trim();

  if (apiKey == null || apiKey.length === 0) {
    throw new OpenAIConfigurationError("OPENAI_API_KEY が設定されていません。");
  }

  return new OpenAICloverHintGenerator({
    apiKey,
    model: env.OPENAI_MODEL,
  });
};

export class OpenAICloverHintGenerator implements CloverHintGenerator {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly endpoint: string;
  private readonly fetcher: typeof fetch;

  constructor(config: OpenAICloverHintGeneratorConfig) {
    const apiKey = config.apiKey.trim();

    if (apiKey.length === 0) {
      throw new OpenAIConfigurationError(
        "OPENAI_API_KEY が設定されていません。",
      );
    }

    this.apiKey = apiKey;
    this.model = config.model?.trim() || defaultOpenAIModel;
    this.endpoint = config.endpoint ?? openAIResponsesEndpoint;
    this.fetcher = config.fetcher ?? fetch;
  }

  async generate(
    request: CloverHintGenerationRequest,
  ): Promise<CloverHintGenerationResult> {
    const response = await this.sendRequest(request);

    if (!response.ok) {
      throw new OpenAIRequestError(
        await this.createRequestErrorMessage(response),
        response.status,
      );
    }

    const responseBody = await parseResponseJson(response);

    return parseCloverHintsFromOpenAIResponse(responseBody);
  }

  private async sendRequest(
    request: CloverHintGenerationRequest,
  ): Promise<Response> {
    try {
      // OpenAI への通信は infrastructure 層に閉じ込め、usecase 層へ API 仕様を漏らさない。
      return await this.fetcher(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.createRequestBody(request)),
      });
    } catch {
      throw new OpenAIRequestError(
        "OpenAI API からレスポンスを受信する前にリクエストが失敗しました。",
      );
    }
  }

  private createRequestBody(request: CloverHintGenerationRequest) {
    // Structured Outputs を使い、OpenAI から返る JSON の形を固定する。
    return {
      model: this.model,
      input: [
        {
          role: "developer",
          content: cloverHintDeveloperMessage,
        },
        {
          role: "user",
          content: buildCloverHintPrompt(request),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "clover_hints",
          schema: cloverHintsJsonSchema,
          strict: true,
        },
      },
    };
  }

  private async createRequestErrorMessage(response: Response): Promise<string> {
    const errorBody = await readErrorBody(response);

    if (errorBody == null) {
      return `OpenAI API リクエストが失敗しました。ステータス: ${response.status}`;
    }

    return `OpenAI API リクエストが失敗しました。ステータス: ${response.status}、詳細: ${errorBody}`;
  }
}

const readErrorBody = async (response: Response): Promise<string | null> => {
  try {
    const body = await response.json();

    if (isRecord(body) && isRecord(body.error)) {
      const message = body.error.message;
      return typeof message === "string" ? message : null;
    }

    return null;
  } catch {
    return null;
  }
};

const parseResponseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの body が有効な JSON ではありません。",
    );
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
