'use server';

import { z } from 'zod';
import { CaptureMethod } from '@mollie/api-client';
import { ExtendedPaymentMethod, AddressSource } from './types';

export async function validateFormData(formData: FormData) {
    const form = Object.fromEntries(formData.entries());

    const formSchema = z.object({
        firstname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        lastname: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        company: z.string().optional(),
        email: z.email({ message: 'Must be valid email address.' }),
        address: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        city: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        zip_code: z
            .string()
            .min(1, { message: 'Must be at least 1 character long.' }),
        country: z.string().toUpperCase().length(2),
        payment_method: ExtendedPaymentMethod,
        cardToken: z.string().startsWith('tkn_').optional(),
        captureMode: z.enum(CaptureMethod).optional(),
        currency: z.string().length(3),
    });

    try {
        const result = formSchema.parse(form);
        return result;
    } catch (error) {
        throw new Error(`Computer says no: ${error}`);
    }
}

export async function validateUrl(url: string) {
    const urlSchema = z.url();
    try {
        const result = urlSchema.parse(url);
        return result;
    } catch (error) {
        throw new Error(`No valid URL.`);
    }
}

export async function validateMolliePayment(id: string) {
    const paymentSchema = z.string().startsWith('tr_');
    try {
        const result = paymentSchema.parse(id);
        return result;
    } catch (error) {
        throw new Error(`No valid Mollie payment ID.`);
    }
}

export async function validateCurrency(currency: string) {
    const currencySchema = z.string().length(3);
    try {
        const result = currencySchema.parse(currency);
        return result;
    } catch (error) {
        throw new Error(`No valid currency.`);
    }
}

export async function validateCaptureAmount(amount: string, max: string): Promise<string> {
    const maxNum = parseFloat(max);
    const schema = z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: 'Must be a valid amount (e.g. 10.00)' })
        .refine(
            (s) => {
                const n = parseFloat(s);
                return n > 0 && n <= maxNum;
            },
            { message: `Amount must be between 0.01 and ${max}` },
        )
        .transform((s) => parseFloat(s).toFixed(2));
    try {
        return schema.parse(amount);
    } catch (error) {
        throw new Error(`Invalid capture amount: ${error}`);
    }
}

export async function validateCountry(country: string) {
    const currencySchema = z.string().toUpperCase().length(2);
    try {
        const result = currencySchema.parse(country);
        return result;
    } catch (error) {
        throw new Error(`No valid country.`);
    }
}

// Whether the checkout should collect the billing address via our own form,
// or delegate it to the Mollie Express Checkout session. Falls back to
// 'form' on any invalid input rather than throwing, since this is a
// non-critical UI toggle (unlike currency/country, which feed the payment).
export async function validateAddressSource(value: string): Promise<AddressSource> {
    const addressSourceSchema = z.enum(['form', 'session']);
    try {
        return addressSourceSchema.parse(value);
    } catch (error) {
        return 'form';
    }
}

// Used both for the `from` pagination cursor and for a balance transaction's
// own ID in the detail route — both are the same `baltr_…` identifier.
export async function validateBalanceTransactionId(id: string) {
    const schema = z.string().startsWith('baltr_');
    try {
        return schema.parse(id);
    } catch (error) {
        throw new Error(`No valid Mollie balance transaction ID.`);
    }
}

// The `history` query param on /balances is a client-maintained stack of
// previously-visited cursors (see BalancesControls — Mollie's API provides
// no backward pagination link, so we track it ourselves). Each entry is
// either a `baltr_…` cursor, or the '~' sentinel for "the first page, which
// has no cursor of its own".
export async function validateBalanceTransactionHistory(
    value: string,
): Promise<string[]> {
    const entrySchema = z.union([z.literal('~'), z.string().startsWith('baltr_')]);
    const schema = z
        .string()
        .transform((s) => s.split(','))
        .pipe(z.array(entrySchema));
    try {
        return schema.parse(value);
    } catch (error) {
        throw new Error(`No valid balance transaction history.`);
    }
}
