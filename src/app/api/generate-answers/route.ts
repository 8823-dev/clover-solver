import { GenerateCloverHintsUseCase } from "@/application/usecases";
import { CloverHintValidationError } from "@/domain/clover/errors";
import {
  createOpenAICloverHintGeneratorFromEnv,
  OpenAIConfigurationError,
  OpenAIRequestError,
  OpenAIResponseParseError,
} from "@/infrastructure/openai";
import {
  createGenerateAnswersSuccessResponse,
  parseGenerateAnswersRequest,
  type GenerateAnswersErrorCode,
  type GenerateAnswersResponse,
} from "@/shared/api/generateAnswers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const requestBodyResult = await readRequestBody(request);

  if (!requestBodyResult.ok) {
    return createErrorResponse(
      "INVALID_JSON",
      "リクエスト body が JSON 形式ではありません。",
      400,
    );
  }

  const parsedRequest = parseGenerateAnswersRequest(requestBodyResult.value);

  if (!parsedRequest.ok) {
    return createErrorResponse("VALIDATION_ERROR", parsedRequest.message, 400);
  }

  try {
    const useCase = new GenerateCloverHintsUseCase(
      createOpenAICloverHintGeneratorFromEnv(),
    );
    const result = await useCase.execute(parsedRequest.value);

    return NextResponse.json<GenerateAnswersResponse>(
      createGenerateAnswersSuccessResponse(result.hints),
    );
  } catch (error) {
    return handleGenerateAnswersError(error);
  }
};

const readRequestBody = async (
  request: Request,
): Promise<
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false }
> => {
  try {
    return {
      ok: true,
      value: await request.json(),
    };
  } catch {
    return {
      ok: false,
    };
  }
};

const handleGenerateAnswersError = (error: unknown) => {
  if (error instanceof CloverHintValidationError) {
    return createErrorResponse("VALIDATION_ERROR", error.message, 400);
  }

  if (error instanceof OpenAIConfigurationError) {
    return createErrorResponse(
      "SERVER_CONFIGURATION_ERROR",
      "サーバー設定に問題があります。",
      500,
    );
  }

  if (error instanceof OpenAIRequestError) {
    return createErrorResponse(
      "OPENAI_REQUEST_ERROR",
      "回答生成 API へのリクエストに失敗しました。",
      502,
    );
  }

  if (error instanceof OpenAIResponseParseError) {
    return createErrorResponse(
      "OPENAI_RESPONSE_ERROR",
      "回答生成 API のレスポンスを解析できませんでした。",
      502,
    );
  }

  return createErrorResponse(
    "INTERNAL_SERVER_ERROR",
    "予期しないエラーが発生しました。",
    500,
  );
};

const createErrorResponse = (
  code: GenerateAnswersErrorCode,
  message: string,
  status: number,
) =>
  NextResponse.json<GenerateAnswersResponse>(
    {
      error: {
        code,
        message,
      },
    },
    {
      status,
    },
  );

