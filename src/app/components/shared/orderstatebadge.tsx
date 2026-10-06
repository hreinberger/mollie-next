import { Badge } from '@radix-ui/themes';
import { JSX } from 'react';

export default function StateBadge(props: { state: string }) {
    let state: string = props.state;
    let result: JSX.Element = <Badge color="gray">{state}</Badge>;

    switch (state) {
        case 'pending':
            result = <Badge color="amber">{state}</Badge>;
            break;
        case 'paid':
            result = <Badge color="green">{state}</Badge>;
            break;
        case 'open':
            result = <Badge color="teal">{state}</Badge>;
            break;
        case 'canceled':
            result = <Badge color="red">{state}</Badge>;
            break;
        case 'expired':
            result = <Badge color="amber">{state}</Badge>;
            break;
        case 'authorized':
            result = <Badge color="teal">{state}</Badge>;
            break;
        case 'failed':
            result = <Badge color="red">{state}</Badge>;
            break;
        default:
            result = <Badge color="gray">{state}</Badge>;
            break;
    }

    return result;
}
