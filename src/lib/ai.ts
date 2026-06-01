import OpenAI from "openai";

// Abstract interface for future AI providers
export interface AIProvider {
  generateText(prompt: string): Promise<string>;
  generateJSON(prompt: string, schema?: any): Promise<any>;
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy",
    });
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content || "";
  }

  async generateJSON(prompt: string): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }
}

// Factory to swap providers easily in the future
export function getAIProvider(): AIProvider {
  return new OpenAIProvider();
}
