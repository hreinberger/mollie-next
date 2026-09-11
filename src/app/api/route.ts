import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        // Parse the incoming webhook payload and log it
        // Mollie webhooks POST an `application/x-www-form-urlencoded` body: id=tr_xxx
        const payload = await request.text();
        const paymentId = new URLSearchParams(payload).get('id');
        console.log('Received webhook for payment:', paymentId, payload);
        // Every time a webhook comes in, we revalidate the /payments page
        revalidatePath('/payments');
        return new Response('Webhook successfully received', {
            status: 200,
        });
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 403,
        });
    }
}
