export const truncateEthereumAddress = (address: string) =>
  address.slice(0, 6) + "..." + address.slice(37);
