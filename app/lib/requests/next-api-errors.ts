import { NextResponse } from "next/server";

export function handleError(error: any) {
    console.error('Error: ', error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status });
  }