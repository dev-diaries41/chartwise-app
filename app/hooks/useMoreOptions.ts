import React, { useState } from 'react'

export const useMoreOptions = () => {
    const [webhookUrl, setWebhookUrl] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const handleTelegramUsernameChange = (e: any) => setTelegramUsername(e.target.value)
    const handleWebhookUrlChange = (e: any) => setWebhookUrl(e.target.value)

 return{
  handleWebhookUrlChange,
  handleTelegramUsernameChange,
  webhookUrl,
  telegramUsername,
 }
}

export default useMoreOptions