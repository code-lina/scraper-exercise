// This function fetches products from the API for a given price range
function fetchProducts(minPrice, maxPrice) {
  
  // Not a real API call (as if we're connecting to the server and return some dummy data)
  return {
    total: 99999,
    count: 1000,
    products: [{}, {}, /* ... */],
  };
}

// This function scrapes all products from the API
async function getAllProducts() {

  // Array to store all products
  const allProducts = [];

  let minPrice = 0;
  const maxPrice = 100000;

  while (true) {
    // Fetch products for the current price range
    const dummyData = await fetchProducts(minPrice, maxPrice);
    const dummyProducts = dummyData.products;

    // Check if there are any products returned
    if (!dummyProducts || dummyProducts.length === 0) {
      // If no products found, break the loop
      break;
    }

    // Add the fetched products to the allProducts array
    for (const product of dummyProducts) {
      allProducts.push(product);
    }

    // Update the minPrice for the next request to overcome the limitation of the API
    let maxProductPrice = 0;
    // Find the maximum product price among the fetched products
    for (const product of dummyProducts) {
      // Check if the product has a valid price and its price is greater than the current maxProductPrice
      if (product.price && product.price > maxProductPrice) {
        // Holds the highest product price found in the array
        maxProductPrice = product.price;
      }
    }
    // Next API call fetches products with prices greater than the highest price from the current response
    minPrice = maxProductPrice + 0.01;

    // If the minimum price exceeds the maximum price, break the loop, all products in the specified price range are fetched
    if (minPrice > maxPrice) {
      break;
    }
  }

  return allProducts;
}

//Scrape products and show the total count
getAllProducts().then(function (allProducts) {
  console.log("Total products scraped:", allProducts.length);
});