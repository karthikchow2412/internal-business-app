const DUMMY_PRODUCTS = [
  { id: 1, name: "Cement Bag 50kg", price: 380, moq: 5 },
  { id: 2, name: "Steel Rod 10mm", price: 620, moq: 3 },
  { id: 3, name: "Wall Paint 20L", price: 1150, moq: 2 },
  { id: 4, name: "Floor Tiles Box", price: 890, moq: 4 }
];

export async function fetchProducts() {
  // Simulates a real API delay.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return DUMMY_PRODUCTS;
}
