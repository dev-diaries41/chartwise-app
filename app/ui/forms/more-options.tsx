'use client'
import React from 'react';
import { MoreOptionsProps } from '@/app/types';


export default function MoreOptions({
  webhookUrl,
  telegramUsername,
  handleTelegramUsernameChange,
  handleWebhookUrlChange
 }: Partial<MoreOptionsProps>) {


  return (
    <div className="w-full p-4  mb-4 shadow-md rounded-md text-white bg-[#444]">
      <div className="flex md:flex-col flex-col mb-8 gap-4">
        <input
          type="text"
          placeholder="Enter webhook url (optional)"
          className=" w-full  h-10 px-3 py-2 mb-2 border-transparent rounded-md  bg-transparent "
          value={webhookUrl}
          onChange={handleWebhookUrlChange}
          maxLength={20}
        />
         <input
          type="text"
          placeholder="Enter telegram username (optional)"
          className=" w-full  h-10 px-3 py-2 mb-2 border-transparent rounded-md  bg-transparent "
          value={telegramUsername}
          onChange={handleTelegramUsernameChange}
          maxLength={20}
        />
      </div>
    </div>
  );
}  