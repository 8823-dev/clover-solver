export const cloverHintsJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hints: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          side: {
            type: "string",
            enum: ["top", "right", "bottom", "left"],
          },
          text: {
            type: "string",
          },
        },
        required: ["side", "text"],
      },
    },
  },
  required: ["hints"],
} as const;

