import React from 'react';
import Script from 'next/script';


export const PriceTable = () => {
  return (
    <>
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
          <div
            dangerouslySetInnerHTML={{
              __html: `
            <stripe-pricing-table pricing-table-id="prctbl_1PZUG5RuKYxTJzY77Mj94KGI"
            publishable-key="pk_test_51PZKw3RuKYxTJzY7fRrVikPv4bkMePyJo7pZAIvOwzQ7GzCxwh9759ZAshZn26puwFeLNz1BuJe9MZJRFOCYtUFZ00pB8OtGJS">
            </stripe-pricing-table>
              `,
            }}
          ></div>
    </>
  );
};



