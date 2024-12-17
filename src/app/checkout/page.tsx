import CheckoutForm from '../components/form/checkoutform';

// import form server components
// since the form itself must be a client component, we import the server components here
// and pass them as props to the form
import Address from '../components/form/address';
import ShoppingCart from '../components/form/shoppingcart';
import HostedPaymentMethods from '../components/form/methods/hostedpaymentmethods';

// invalidate page cache every 5 minutes to pick up new available payment methods
export const revalidate = 300;

export default function Page() {
    return (
        <main>
            <CheckoutForm
                address={<Address />}
                cart={<ShoppingCart />}
                hostedmethods={<HostedPaymentMethods />}
            />
        </main>
    );
}
