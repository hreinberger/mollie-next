import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const session = await getSession();
    session.destroy();
    revalidatePath('/', 'layout');
    return NextResponse.redirect(new URL('/checkout', request.url));
}
