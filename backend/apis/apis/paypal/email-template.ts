export const emailTemplate = (link: string, orderId: string, name: string) => `
<html>
  <div style="flex-direction: column; max-width: 1200px; margin: auto; padding: 50px; font-family: 'Roboto', sans-serif; background-color: #fef6e7; text-align: justify;">
    <div class="logo-container">
      <img
        style="margin: auto; height: auto; max-width: 100%; background-image: url('https://d2j3yisnywcb30.cloudfront.net/pix/rapidbackend.png'); background-size: contain; background-position: center;"
        class="logo"
        src="https://d2j3yisnywcb30.cloudfront.net/pix/rapidbackend.png"
      />
    </div>
    <h1 class="logo-subtext" style="font-size: 20px; color: black">Fast, Reliable, Configurable Back-End</h1>
    <div class="value-section" style="margin: 25px auto; max-width: 800px; font-size: 24px; margin-bottom: 0">
      <p style="color: black">
        Thank you ${name}, for purchasing the eBook! You should click the link below. It is time 
        sensitive. You have <strong style="color: red">3 DAYS</strong> from the time of purchase to download the eBook
        before this link is invalidated. 
      </p>

      <a href=${link}>Download Book</a>

      <p style="color: black; text-align: left; font-size: 14px; margin-bottom: 0;">
        If you have any questions regarding this order, contact 
        Naeem at gtngbooks@gmail.com and reference this order ID: <strong style="font-weight">${orderId}</strong>.
      </p>
    <footer id="footer"></footer>
  </div>
</html>
`;
