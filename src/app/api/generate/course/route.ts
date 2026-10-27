import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let body: any = {};
    let pdfBase64: string | null = null;
    let pdfMimeType: string | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const stateStr = formData.get("state") as string;
      if (stateStr) {
        body = JSON.parse(stateStr);
      }
      const file = formData.get("pdfFile") as File;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        pdfBase64 = Buffer.from(arrayBuffer).toString("base64");
        pdfMimeType = file.type;
      }
    } else {
      body = await req.json();
    }

    const { title, description, category, targetAudience, level, tone, numChapters } = body;

    const toneDescriptions: Record<string, string> = {
      professional: "formal, structured, industry-standard language",
      friendly: "conversational, approachable, encouraging",
      academic: "research-based, citation-friendly, rigorous",
      casual: "relaxed, fun, informal",
      humorous: "funny,witty,entertaining"
    };

    let prompt = `
You are an expert curriculum designer. Create a detailed course outline based on the following:

Title: ${title}
Description: ${description}
Category: ${category}
Target Audience: ${targetAudience}
Difficulty Level: ${level}
Tone: ${tone} — ${toneDescriptions[tone] || tone}
Number of Chapters: ${numChapters}

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "title": "refined course title",
  "description": "compelling 2-3 sentence course description",
  "chapters": [
    {
      "title": "Chapter N: Title",
      "lessons": [
        {
          "title": "Lesson N.N: Title",
          "summary": "1-2 sentence summary of what this lesson covers"
        }
      ]
    }
  ]
}

Each chapter should have 3-5 lessons. Ensure the tone is ${tone} throughout all titles and summaries.
`;

    if (pdfBase64) {
      prompt = `I have attached a PDF document. Please read through this entire document and extract the core concepts. ` + prompt + `\nCRITICAL INSTRUCTION: Base the curriculum ENTIRELY on the concepts, material, and structure found within the attached PDF.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const requestParts: any[] = [prompt];

    if (pdfBase64 && pdfMimeType) {
      requestParts.push({
        inlineData: {
          data: pdfBase64,
          mimeType: pdfMimeType
        }
      });
    }

    const result = await model.generateContent(requestParts);
    let text = result.response.text();

    // Clean up markdown block if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[GENERATE_COURSE_ERROR]", error);
    return new NextResponse("Failed to generate course", { status: 500 });
  }
}
