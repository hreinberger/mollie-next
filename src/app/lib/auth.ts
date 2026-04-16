import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
    email: string;
    name: string;
    picture: string;
    isMollie: boolean;
};

export const sessionOptions = {
    cookieName: 'mollie_demo_session',
    password: process.env.AUTH_SECRET as string,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    return session;
}

export function getGoogleAuthUrl() {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        redirect_uri: `${process.env.DOMAIN}/api/auth/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'online',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
