import { AuthErrors } from "@/app/constants/errors";
import { FPF_LABS_API_KEY, REFRESH_TOKEN_URL } from "@/app/constants/app";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const getFormData = async (req: NextRequest) => {
  const formData = await req.formData();
  const userId = formData.get('userId') as string | undefined;

  if (!userId) {
    throw new Error(AuthErrors.INVALID_USER_ID);
  }
  return { userId };
};

const getAuthToken = async ({ userId }: { userId: string }) => {
  const headers = {
    'api-key': FPF_LABS_API_KEY,
  };
  const reqBody = { userId };

  try {
    const response = await axios.post(REFRESH_TOKEN_URL, reqBody, { headers });

    if (response.status !== 200) throw new Error(response.data.message);
    
    const authHeader = response.headers['authorization'];
    const newToken = authHeader?.split(' ')[1];

    if (!newToken) throw new Error('Failed to get new token');

    return newToken;
  } catch (error: any) {
    throw error;
  }
};


export async function POST(req: NextRequest) {
  try {
    const { userId } = await getFormData(req);
    const newToken = await getAuthToken({ userId });
    const nextResponse = NextResponse.json({ status: 200 });
    nextResponse.headers.append('Authorization', `Bearer ${newToken}`);
    return nextResponse;
  } catch (error: any) {
    console.error(error.message);
    const status = error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status });
  }
}
