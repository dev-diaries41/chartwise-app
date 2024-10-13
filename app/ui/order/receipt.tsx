import React from 'react';
import { getPlanFromPlanAmount } from '@/app/lib/helpers';

interface ReceiptProps {
  amount: number;
  email: string;
}

export default function Receipt ({amount, email}: ReceiptProps){
  return (
    <td className="p-0 m-0">
      {/* Wrapper */}
      <table className="w-full max-w-5xl mx-auto text-black table-fixed shadow-md rounded-lg bg-zinc-700 p-4 sm:p-6 lg:p-8">
        <tbody>
          <tr>
            <td className="p-0 m-0">
              <div className="w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
                <table className="w-full mb-6">
                  <tbody>
                    <tr>
                      <td className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">Order summary</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full mb-6">
                  <tbody>
                    <tr>
                      <td className="flex flex-wrap gap-4 pb-2">
                        <div className="w-full md:w-1/3">
                          <span className="text-base font-semibold text-gray-800">Email:</span>
                          <span className="text-base text-gray-600"> {email}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full mb-6">
                  <thead>
                    <tr>
                      <th className="w-1/2 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="w-1/6 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="w-1/3 py-2 pl-4 pr-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="w-1/2 py-2 pl-4 pr-6 border-b border-gray-200 text-base font-medium text-gray-800">{`Subscription ${getPlanFromPlanAmount(amount)?? ''} x 1`}</td>
                      <td className="w-1/6 py-2 pl-4 pr-6 border-b border-gray-200 text-base text-gray-600"></td>
                      <td className="w-1/3 py-2 pl-4 pr-6 border-b border-gray-200 text-base font-medium text-right text-gray-800">{'£' + amount/100}</td>
                    </tr>
                    <tr>
                      <td className="w-1/2 py-2 pl-4 pr-6 border-b border-gray-200 text-base font-medium text-gray-800">Amount charged:</td>
                      <td className="w-1/6 py-2 pl-4 pr-6 border-b border-gray-200 text-base text-gray-600"></td>
                      <td className="w-1/3 py-2 pl-4 pr-6 border-b border-gray-200 text-base font-medium text-right text-gray-800">{'£' + amount/100}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full mb-6">
                  <tbody>
                  <tr>
                    <td className="pl-4 pr-6 pt-4 pb-2 border-b border-gray-200">
                      If you have any questions, send an <a href="mailto:support@fpflabs.app" className="underline">email</a>.
                    </td>
                  </tr>
                  </tbody>
                </table>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {/* /Wrapper */}
    </td>
  );
};
