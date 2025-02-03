import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { AnalysisParams } from "@/app/types";
import { generateTextFromImageStream, generateTextFromMutliImagesStream } from "@/app/lib/ai/openai";
import { chartAnalysisPrompt } from "@/app/lib/ai/prompts";
import { checkUsageLimit } from "@/app/lib/data/usage";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const analysisParams = (await req.json()) as AnalysisParams;
    if (!analysisParams) return NextResponse.json({ message: "Invalid analysis input", status: 400 },{ status: 400 });

    const result = await checkUsageLimit(session?.user.email);
    if (!result.isAllowed) return NextResponse.json({ message: result.message, status: 403 },{ status: 403 });

    const {chartUrls, metadata} = analysisParams;
    const prompt =  chartAnalysisPrompt(metadata, chartUrls.length > 1);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openaiStream = chartUrls.length > 1? await generateTextFromMutliImagesStream(prompt, chartUrls) : await generateTextFromImageStream(prompt, chartUrls[0])
          for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }

          controller.close();
        } catch (error: any) {
          controller.error(error?.message);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return handleError(error);
  }
}
