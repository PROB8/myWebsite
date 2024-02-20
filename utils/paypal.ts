import PaypalCartItem from '@/types/paypalCartItem';
import {
  PayPalButtonsComponentOptions,
  PayPalNamespace,
  loadScript,
} from '@paypal/paypal-js';
type CartOptions = {
  onSuccess: () => void;
  purchaseUnits: PaypalCartItem[];
  clearCart: () => void;
  onError: () => void;
};

export default async function loadPaypal(
  options: CartOptions
): Promise<PayPalNamespace | null> {
  document.getElementById('paypal-button-container')?.replaceChildren();
  const { onSuccess, onError, clearCart } = options;
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

        // Function to show the spinner
        // function showSpinner() {
        //   payPalButtonContainer.style.display = 'none';
        //   spinner.style.display = 'block';
        // }

        // // Function to hide the spinner
        // function hideSpinner() {
        //   spinner.style.display = 'none';
        // }

        // showSpinner();
        //@ts-ignore
        let response;
        // send pdf
        fetch(process.env.NEXT_PUBLIC_PAYPAL_API_URL as string, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          referrerPolicy: 'origin',
          body: JSON.stringify({
            email: orderData.payer.email_address,
            firstName: orderData.payer.name.given_name,
            lastName: orderData.payer.name.surname,
            orderData,
          }),
        })
          .then((res) => {
            response = res.json();
            if (res.ok) {
              // const element = document.getElementById('success-message');
              // //@ts-ignore
              // element.innerHTML = `<p class="text-align-left margin-zero-top-50">${orderData.payer.name.given_name},
              //       Thank you for your purchase! Please check your email,
              //       <span class="email">${orderData.payer.email_address}</span> for the link to download your eBook.
              //       The link is active for <strong class="red">3 DAYS</strong> so act fast and check your spam folder
              //       if you do not see the email in your main inbox.</p>
              //     `;
              onSuccess();
              payPalButtonContainer?.replaceChildren();
              return;
            }
            throw new Error('Something broke: Could not send ebook');
          })
          .catch((e) => {
            // const element = document.getElementById('success-message');
            // //@ts-ignore
            // element.innerHTML = `<p class="text-align-left margin-zero-top-50">${orderData.payer.name.given_name},
            //       We were not able to send your eBook! Please contact us at gtngbooks@gmail.com and supply the following
            //       orderId: <span class="bold">${orderData.id}</span>!
            //     `;
            // hideSpinner();
            onError();
            //@ts-ignore
            console.log(response);
            console.error(e);
          });
      });
    },

    onError: function (err: any) {
      // const element = document.getElementById('success-message');
      // //@ts-ignore
      // element.innerHTML = `<p class="text-align-left margin-zero-top-50">${orderData.payer.name.given_name},
      //             We were not able to fulfill your purchase! Please try again!`;
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
