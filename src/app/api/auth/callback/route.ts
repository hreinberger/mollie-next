import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(
            new URL('/checkout', process.env.DOMAIN as string),
        );
    }

    try {
        const tokenResponse = await fetch(
            'https://oauth2.googleapis.com/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: `${process.env.DOMAIN}/api/auth/callback`,
                    grant_type: 'authorization_code',
                }),
            },
        );

        if (!tokenResponse.ok) {
            return NextResponse.redirect(
                new URL('/checkout', process.env.DOMAIN as string),
            );
        }

        const tokens = await tokenResponse.json();
        const idToken = tokens.id_token as string;

        // Decode the JWT payload (middle segment) — we trust the token because
        // we just exchanged it ourselves via HTTPS with our client secret
        const payload = JSON.parse(
            Buffer.from(idToken.split('.')[1], 'base64url').toString(),
        ) as { email: string; name: string; picture: string };

        const session = await getSession();
        session.email = payload.email;
        session.name = payload.name;
        session.picture = payload.picture;
        // check if the email domain is @mollie.com to grant access to dangerous features
        session.isMollie = payload.email.endsWith('@mollie.com');
        await session.save();
    } catch {
        // On any error, fall through to unauthenticated state
    }

    return NextResponse.redirect(
        new URL('/checkout', process.env.DOMAIN as string),
    );
}
