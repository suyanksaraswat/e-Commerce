import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import { env } from '../../env/server.mjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Initialize razorpay object
    const razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY,
      key_secret: env.RAZORPAY_SECRET,
    });

    // Create an order -> generate the OrderID -> Send it to the Front-end
    const payment_capture = 1;
    const amount = 499;
    const currency = 'INR';
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    // Handle any other HTTP method
  }
}
