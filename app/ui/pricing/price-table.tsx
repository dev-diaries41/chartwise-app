import React from 'react';
import Script from 'next/script';

// export const PriceTestTable = () => {
//   return (
//     <>
//       <Script async src="https://js.stripe.com/v3/pricing-table.js" />
//           <div
//             dangerouslySetInnerHTML={{
//               __html: `
//             <stripe-pricing-table pricing-table-id="prctbl_1PZUG5RuKYxTJzY77Mj94KGI"
//             publishable-key="pk_test_51PZKw3RuKYxTJzY7fRrVikPv4bkMePyJo7pZAIvOwzQ7GzCxwh9759ZAshZn26puwFeLNz1BuJe9MZJRFOCYtUFZ00pB8OtGJS">
//             </stripe-pricing-table>
//               `,
//             }}
//           ></div>
//     </>
//   );
// };

export const PriceTable = () => {
  return (
    <>
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
          <div
            dangerouslySetInnerHTML={{
              __html: `
            <stripe-pricing-table pricing-table-id="prctbl_1PcOjkRuKYxTJzY7Ff053aVm"
            publishable-key="pk_live_51PZKw3RuKYxTJzY7uGxp0Dek1d7fOnKDa5WaA8hXi1dTXzmwS8kQVr2819GAa8rO99nUAG0nAPFInTOZT9hTouzk00ReEbaZgw">
            </stripe-pricing-table>

              `,
            }}
          ></div>
    </>
  );
};




