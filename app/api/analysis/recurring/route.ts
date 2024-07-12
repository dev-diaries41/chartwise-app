import { RequestErrors, ToolErrors } from "@/app/constants/errors";
import { CHART_ANALYSIS_RECURRING_URL, FPF_LABS_API_KEY } from "@/app/constants/app";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const image: string | null = formdata.get('image') as string

    if (!image) {
      return NextResponse.json({ message: RequestErrors.MISSING_IMAGE, status: 400});
    }
    const headers = {
      'api-key': FPF_LABS_API_KEY
    }
    const reqBody = {when: Date.now(), jobData: {image}}
    const response = await axios.post(CHART_ANALYSIS_RECURRING_URL, reqBody, {headers});
    const {success} = response.data;
    if(!success)throw new Error(ToolErrors.CHART_ANALYSIS)

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(ToolErrors.CHART_ANALYSIS, error.message)
    return NextResponse.json({ error: ToolErrors.CHART_ANALYSIS, status: 500})
    }
  };
