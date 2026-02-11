// Price formatting utility
export const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Currency formatting utility
export const formatCurrency = (price) => {
  return formatPrice(price) + ' UZS';
};