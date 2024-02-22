import PaypalCartItem from '@/types/paypalCartItem';
import {
  PayPalButtonsComponentOptions,
  PayPalNamespace,
  loadScript,
} from '@paypal/paypal-js';
import { Dispatch, SetStateAction } from 'react';
type CartOptions = {
  setLodingModalIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalOpen: () => void;
  onSuccess: () => void;
  purchaseUnits: PaypalCartItem[];
  clearCart: () => void;
  onError: () => void;
};

export default async function loadPaypal(
  options: CartOptions
): Promise<PayPalNamespace | null> {
  document.getElementById('paypal-button-container')?.replaceChildren();
  const { onSuccess, onError, clearCart, setLodingModalIsOpen, setModalOpen } = options;
  const buttonOptions = {
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'paypal',
    },

    createOrder: function (data: any, actions: any) {
      return actions.order.create({
        purchase_units: options.purchaseUnits,
      });
    },

    onApprove: function (data: any, actions: any) {
      return actions.order.capture().then(function (orderData: any) {
        const payPalButtonContainer = document.getElementById(
          'paypal-button-container'
        );
       
        setLodingModalIsOpen(true)
        setModalOpen()
        fetch(process.env.NEXT_PUBLIC_PAYPAL_API_URL as string, {
          method: 'POST',
          mode: 'cors',
          referrerPolicy: 'origin',
          body: JSON.stringify({
            email: orderData.payer.email_address,
            firstName: orderData.payer.name.given_name,
            lastName: orderData.payer.name.surname,
            orderData,
          }),
        })
          .then((res: any) => {
            const response = res.json();
            if (res.ok) {
              setLodingModalIsOpen(false)
              //TODO:       Thank you for your purchase! Please check your email,
              onSuccess();
              payPalButtonContainer?.replaceChildren();
              return;
            }
            console.log({response})
            throw new Error('Something broke: order cannot be sent');
          })
          .catch((e) => {
            console.log("IN HERE")
            onError()
            //     Todo:   We were not able to send your eBook! Please contact us at gtngbooks@gmail.com and supply the following
       
            setLodingModalIsOpen(false)
            console.error(e);
          });
      });
    },

    onError: function (err: any) {
      onError()
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
    } catch (error) {
      console.error(error);
    }
  }

  return paypal;
}
