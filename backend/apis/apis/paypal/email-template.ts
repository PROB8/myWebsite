export const emailTemplate = (
  link: string,
  orderId: string,
  name: string,
  boughtPyl: boolean,
  boughtRb: boolean,
  boughtConsult: boolean,
  consultLink: string
) => `
<html>
  <div style="max-width: 1200px; margin: auto; padding: 50px; font-family: 'Roboto', sans-serif; background-color: #fff;">
    <div class="header-container" style="display: flex; justify-content: space-between;">
      <div
        style="
          width: 170px;
          height: 170px;
          border-radius: 50%;
          overflow: hidden;
          background-image: url(https://d2j3yisnywcb30.cloudfront.net/pix/NaeemGitonga.jpg);
          background-position: 50% 20%;
          background-size: 163%;
        "
      ></div>
      <h1 class="logo-subtext" style="margin: auto ; color: black">Thank you for your purchase!</h1>
    </div>

    <div class="value-section" style="margin: 25px auto; max-width: 800px; font-size: 24px; margin-bottom: 0">
      <p style="color: black">
        Thank you ${name}, I am grateful that you have chosen to shop with me! 
      </p>

      ${
        boughtPyl
          ? `<p style="color: black">
          Please allow 7-10 business to receive your order of Program Your Life.
          Once your order has shipped, you will receive an email containing the tracking number. 
        </p>`
          : ''
      }

      ${
        boughtRb
          ? `<p style="color: black">
          Please click the link below to download your copy of Rapid Back-End. It is time 
          sensitive. You have <strong style="color: red">3 DAYS</strong> from the time of purchase to download the eBook
          before this link is invalidated. 
        </p>

        <a href=${link}>Download Rapid Back-End eBook</a>`
          : ''
      }

      ${
        boughtConsult
          ? `<p style="color: black">
          Please book your time <a href=${consultLink}>here</a>.
        </p>`
          : ''
      }

      <p style="color: black; text-align: left; font-size: 14px; margin-bottom: 0;">
        If you have any questions regarding this order, contact 
        Naeem at <a href="mailto:gtngbooks@gmail.com">gtngbooks@gmail.com</a> and reference this order ID: <strong style="font-weight">${orderId}</strong>.
      </p>
    <footer id="footer"></footer>
  </div>
</html>`;
