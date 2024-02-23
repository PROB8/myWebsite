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
import { Dispatch, SetStateAction } from 'react';
import { Subject } from 'rxjs';

export const callBackend = new Subject<OrderResponseBody>();

type CartOptions = {
  setLodingModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setShowLoadingDots: Dispatch<SetStateAction<boolean>>;
  setModalOpen: () => void;
  onSuccess: () => void;
  purchaseUnits: PaypalCartItem[];
  clearCart: () => void;
  onError: () => void;
};

export default async function loadPaypal(
  options: CartOptions
): Promise<PayPalNamespace | null> {
  const buttonContainer = document.getElementById('paypal-button-container');
  if (buttonContainer) {
    buttonContainer.replaceChildren();
  }
  const {
    setShowLoadingDots,
    onError,
    clearCart,
    setLodingModalIsOpen,
    setModalOpen,
  } = options;
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

    onApprove: function (data: OnApproveData, actions: OnApproveActions) {
      if (!actions.order) {
        return;
      }
      console.log({ data });
      return actions.order.capture().then(function (
        orderData: OrderResponseBody
      ) {
        setLodingModalIsOpen(true);
        setModalOpen();
        callBackend.next(orderData);
      });
    },

    onError: function (err: any) {
      onError();
      //TODO:             We were not able to fulfill your purchase! Please try again!`;
      console.log(err);
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

type InternalFulfillmentApiProps = {
  orderData: OrderResponseBody;
  setLodingModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setPaymentSuccessful: Dispatch<SetStateAction<boolean>>;
  setShowButtonContainer: Dispatch<SetStateAction<boolean>>;
  payPalButtonContainer: HTMLElement | null;
  setWhichHeight: Dispatch<SetStateAction<string>>;
  cartHeight: string;
};
export function callInternalFulfillmentApi(props: InternalFulfillmentApiProps) {
  const {
    orderData,
    setLodingModalIsOpen,
    setPaymentSuccessful,
    setShowButtonContainer,
    payPalButtonContainer,
    setWhichHeight,
    cartHeight,
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
        setPaymentSuccessful(true);
        setShowButtonContainer(false);
        payPalButtonContainer?.replaceChildren();
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
