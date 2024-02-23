import CartItem from '@/types/cartItem';
import PaypalCartItem from '@/types/paypalCartItem';
import {
  CreateOrderActions,
  CreateOrderData,
  CreateOrderRequestBody,
  OnApproveActions,
  OnApproveData,
  OrderResponseBody,
  PayPalButtonsComponentOptions,
  PayPalNamespace,
  loadScript,
} from '@paypal/paypal-js';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';

type CartOptions = {
  setLodingModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setShowLoadingDots: Dispatch<SetStateAction<boolean>>;
  onSuccess: (orderData: OrderResponseBody) => void;
  purchaseUnits: PaypalCartItem[];
  clearCart: () => void;
  onError: (error: Record<string, unknown>) => void;
};

export default async function loadPaypal(
  options: CartOptions
): Promise<PayPalNamespace | null> {
  const buttonContainer = document.getElementById('paypal-button-container');
  if (buttonContainer) {
    buttonContainer.replaceChildren();
  }
  const { setShowLoadingDots, onError, onSuccess } = options;
  const buttonOptions = {
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'paypal',
    },
    createOrder: function (
      _data: CreateOrderData,
      actions: CreateOrderActions
    ) {
      return actions.order.create({
        purchase_units: options.purchaseUnits,
      } as unknown as CreateOrderRequestBody); // * all of the value prop for amount should be a string but we have numbers, they are coerced to strings during the request
    },
    onApprove: function (_data: OnApproveData, actions: OnApproveActions) {
      if (!actions.order) {
        return;
      }

      return actions.order.capture().then(function (
        orderData: OrderResponseBody
      ) {
        onSuccess(orderData);
      });
    },
    onError: function (err: Record<string, unknown>) {
      onError(err);
    },
  };

  let paypal: PayPalNamespace | null = null;
  try {
    paypal = (await loadScript({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    })) as PayPalNamespace;
  } catch (error) {
    console.error('failed to load the PayPal JS SDK script', error);
  }

  if (paypal != null && paypal.Buttons) {
    try {
      await paypal
        .Buttons(buttonOptions as PayPalButtonsComponentOptions)
        .render('#paypal-button-container');
      setShowLoadingDots(false); //? do this here so that after the buttons and cart items have fully loaded we show the cart
    } catch (error) {
      console.error(error);
    }
  }

  return paypal;
}

export function createCartForPaypal(cart: CartItem[]) {
  let paypalCart: PaypalCartItem[] = [];
  for (const item of cart) {
    for (let i = 0; i < item.quantity; i++) {
      paypalCart = [
        ...paypalCart,
        {
          reference_id: `${item.id}-${i}`,
          amount: { currency_code: 'USD', value: item.price },
        },
      ];
    }
  }
  return paypalCart;
}

type InternalFulfillmentApiProps = {
  orderData: OrderResponseBody;
  setLodingModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setWhichHeight: Dispatch<SetStateAction<string>>;
  cartHeight: string;
  router: AppRouterInstance;
  clearCart: () => void;
};
export function callInternalFulfillmentApi(props: InternalFulfillmentApiProps) {
  const {
    orderData,
    setLodingModalIsOpen,
    setWhichHeight,
    cartHeight,
    clearCart,
    router,
  } = props;
  fetch(process.env.NEXT_PUBLIC_PAYPAL_API_URL as string, {
    method: 'POST',
    mode: 'cors',
    referrerPolicy: 'origin',
    body: JSON.stringify({
      email: orderData.payment_source?.paypal?.email_address,
      firstName: orderData.payment_source?.paypal?.name?.given_name,
      lastName: orderData.payment_source?.paypal?.name?.surname,
      orderData,
    }),
  })
    .then((res: any) => {
      const response = res.json();
      if (res.ok) {
        //TODO:       Thank you for your purchase! Please check your email,
        setLodingModalIsOpen(false);
        clearCart();
        router.push(`/thanks?referenceId=${orderData.id}`);
        return;
      }
      console.log({ response });
      throw new Error('Something broke: order cannot be sent');
    })
    .catch((e) => {
      setWhichHeight(cartHeight);
      //     Todo:   We were not able to send your eBook! Please contact us at gtngbooks@gmail.com and supply the following
      setLodingModalIsOpen(false);
      console.error(e);
    });
}
