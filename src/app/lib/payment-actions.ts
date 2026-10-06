'use server';

// Server actions for mutating a payment from the payment detail page
// (capture / release / refund). Extracted here to match the convention used
// by createPayment in server-actions.ts, instead of living as closures
// inside the UI component.

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    mollieCapturePayment,
    mollieRefundPayment,
    mollieReleaseAuthorization,
} from '@/app/lib/mollie';
import { validateCaptureAmount } from '@/app/lib/validation';

export async function capturePayment(
    id: string,
    mode: 'test' | 'live',
    remaining: string,
    currency: string,
    formData: FormData,
) {
    const rawAmount = formData.get('amount') as string;
    const validated = await validateCaptureAmount(rawAmount, remaining);
    await mollieCapturePayment(id, mode, { value: validated, currency });
    revalidatePath('/payments/' + id);
    redirect('/payments/' + id + '?mode=' + mode);
}

export async function releaseAuthorization(id: string, mode: 'test' | 'live') {
    await mollieReleaseAuthorization(id, mode);
    revalidatePath('/payments/' + id);
    redirect('/payments/' + id + '?mode=' + mode);
}

export async function refundPayment(
    id: string,
    mode: 'test' | 'live',
    remainingRefundable: string,
    currency: string,
    formData: FormData,
) {
    const rawAmount = formData.get('amount') as string;
    const validated = await validateCaptureAmount(rawAmount, remainingRefundable);
    await mollieRefundPayment(id, mode, { value: validated, currency });
    revalidatePath('/payments/' + id);
    redirect('/payments/' + id + '?mode=' + mode);
}
