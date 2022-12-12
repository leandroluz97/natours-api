/*eslint-disable */
import axios from 'axios';

let stripe = Stripe(
  'pk_test_51MDcHVKBHRClxC4xXCeQkKKaHS55TmmIquGuc4vq5zOiOGoix4vKzpzx9cdRPi8uUDx5ae68dgXtWbvFjS7xDDBW00ETHHqJyJ'
);

export const bookTour = async (tourId) => {
  // 1) Get checkout session from Api
  const session = await axios.get(
    `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
  );

  return session.data;
  // 2) Create checkout form + charge credit card
};
