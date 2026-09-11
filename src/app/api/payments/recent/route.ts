import { mollieGetPayments } from '@/app/lib/mollie';
import { getSession } from '@/app/lib/auth';

export type RecentPayment = {
    id: string;
    mode: 'test' | 'live';
    status: string;
    description: string;
};

async function getRecentPayments(mode: 'test' | 'live'): Promise<RecentPayment[]> {
    try {
        const { payments } = await mollieGetPayments({ mode, limit: 10 });
        return payments.map((payment) => ({
            id: payment.id,
            mode: (payment.mode as 'test' | 'live') ?? mode,
            status: payment.status,
            description: payment.description,
        }));
    } catch (error) {
        console.error(`Failed to fetch ${mode} payments for toast polling:`, error);
        return [];
    }
}

export async function GET() {
    const session = await getSession();
    const isMollie = session?.isMollie === true;

    const [testPayments, livePayments] = await Promise.all([
        getRecentPayments('test'),
        isMollie ? getRecentPayments('live') : Promise.resolve([]),
    ]);

    return Response.json([...testPayments, ...livePayments]);
}
