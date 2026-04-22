import axios from 'axios'

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY

export async function initializePayment(data: {
  amount: number
  email: string
  tx_ref: string
  callback_url: string
  customer_name: string
  meta: any
}) {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: data.tx_ref,
        amount: data.amount,
        currency: 'NGN',
        redirect_url: data.callback_url,
        customer: {
          email: data.email,
          name: data.customer_name,
        },
        customizations: {
          title: 'TrustRent NG Payment',
          description: 'Secure Rent Payment via Escrow',
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        },
        meta: data.meta,
      },
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Flutterwave Init Error:', error.response?.data || error.message)
    throw new Error('Failed to initialize payment')
  }
}

export async function verifyTransaction(id: string) {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Flutterwave Verify Error:', error.response?.data || error.message)
    throw new Error('Failed to verify transaction')
  }
}
