import { PaymentDetails } from "../types";


export async function handlePaymentComplete({email, name, receipt_url, chargeId}: PaymentDetails){
    console.log({email, name, receipt_url, chargeId})
    console.log('payment details receviing succesffuly')
}