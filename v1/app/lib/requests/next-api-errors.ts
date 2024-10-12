import { NextResponse } from "next/server";

export function handleError(error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal Server Error';
    console.error('Error: ', message);
    return NextResponse.json({ message, status, success: false }, { status });
  }