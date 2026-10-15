'use server';

import { Flex } from '@radix-ui/themes';

import { mollieGetPayment } from '@/app/lib/mollie';
import DetailsCard from './payment/DetailsCard';
import CapturesCard from './payment/CapturesCard';
import RefundsCard from './payment/RefundsCard';
import ChangeStateCard from './payment/ChangeStateCard';
import RawJsonDump from '../shared/RawJsonDump';

export default async function PaymentOverview({
    id,
    mode,
}: {
    id: string;
    mode: 'test' | 'live';
}) {
    const { payment, captures, refunds } = await mollieGetPayment(id, mode);

    // amountRemaining is present once any capture/refund activity has occurred.
    // For a fresh authorized payment it is absent, so fall back to amount − amountCaptured.
    const remaining =
        payment.amountRemaining?.value ??
        Math.max(
            0,
            parseFloat(payment.amount.value) -
                parseFloat(payment.amountCaptured?.value ?? '0'),
        ).toFixed(2);
    const remainingRefundable = payment.amountRemaining?.value ?? '0.00';

    const canCapture =
        payment.status === 'authorized' && parseFloat(remaining) > 0;
    const showCapturesSection =
        payment.status === 'authorized' || captures.length > 0;

    const canRefund =
        payment.status === 'paid' && parseFloat(remainingRefundable) > 0;
    const showRefundsSection =
        payment.status === 'paid' || refunds.length > 0;

    const changePaymentStateUrl = payment.links.changePaymentState?.href;
    const canChangePaymentState = payment.status === 'pending' && !!changePaymentStateUrl;

    return (
        <Flex direction="column" pt="4" gap="4">
            {/* ── Row 1: Details card + Captures/Refunds/State cards side by side on desktop ── */}
            <Flex
                direction={{ initial: 'column', md: 'row' }}
                gap="4"
                align={{ initial: 'stretch', md: 'start' }}
                justify="center"
            >
                <DetailsCard
                    payment={payment}
                />

                {(showCapturesSection || showRefundsSection || canChangePaymentState) && (
                    <Flex
                        direction="column"
                        gap="4"
                        style={{ flex: 1, minWidth: 0, maxWidth: 560 }}
                    >
                        {showCapturesSection && (
                            <CapturesCard
                                id={id}
                                mode={mode}
                                currency={payment.amount.currency}
                                remaining={remaining}
                                canCapture={canCapture}
                                captures={captures}
                            />
                        )}

                        {canChangePaymentState && (
                            <ChangeStateCard changePaymentStateUrl={changePaymentStateUrl!} />
                        )}

                        {showRefundsSection && (
                            <RefundsCard
                                id={id}
                                mode={mode}
                                currency={payment.amount.currency}
                                remainingRefundable={remainingRefundable}
                                canRefund={canRefund}
                                refunds={refunds}
                            />
                        )}
                    </Flex>
                )}
            </Flex>

            {/* ── Row 2: Raw payment data — own card at the bottom ── */}
            <RawJsonDump label="Raw Payment Data" data={payment} />
        </Flex>
    );
}
