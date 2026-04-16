import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/app/lib/auth';

export function GET() {
    return NextResponse.redirect(getGoogleAuthUrl());
}
