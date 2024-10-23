import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { OnboardingAnswers } from "@/app/types";
import { completedOnboarding } from "@/app/lib/user";

export async function POST(req: NextRequest) {
  try {
    const {email, answers} = await req.json() as {email: string; answers: OnboardingAnswers};

    if (!email) return NextResponse.json({ message: AuthErrors.INVALID_USER_ID, status: 400},{status:400} );
    if (!answers) return NextResponse.json({ message: 'Invalid onboarding answers', status: 400},{status:400} );
    
    const result = await completedOnboarding(email, answers);
    return NextResponse.json({data: result});; 
  } catch (error: any) {
   return handleError(error)
  }
};