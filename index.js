const Apify = require('apify');

// Defining the price ranges for filtering products
const PIVOT_PRICE_RANGES = [
    { min: 0, max: 9.99 },
    { min: 10, max: 99.99 },
    { min: 100, max: 999.99 }
];

// Maximum number of products per pagination
const MAX_PRODUCTS_PAGINATION = 1000;

// Main function
async function main() {
    // Opening a request queue
    const requestQueue = await Apify.openRequestQueue();

    // Enqueueing the initial requests for each price range
    for (const { min, max } of PIVOT_PRICE_RANGES) {
        const url = `https://www.ecommerce.com/products?minPrice=${min}&maxPrice=${max}`;
        requestQueue.addRequest({ url, userData: { label: 'FILTER' } });
    }

    // Creating a crawler
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction: async ({ request, $ }) => {
            const { label } = request.userData;

            // Checking if the page is for filtering products
            if (label === 'FILTER') {
                const productCount = $('.product-count').text();

                // Checking if pagination is needed
                if (productCount <= MAX_PRODUCTS_PAGINATION) {
                    // Enqueue the first page for scraping
                    const nextPageUrl = `${request.url}&page=1`;
                    requestQueue.addRequest({ url: nextPageUrl, userData: { label: 'PAGINATION' } });
                } else {
                    console.log(`Too many products for range: ${request.url}`);
                }
            }

            // Handling pagination if necessary
            if (label === 'PAGINATION') {
                console.log(`Scraping products from: ${request.url}`);
                // then extracting product info from the page and saving it
            }
        },
    });

    // Running the crawler
    await crawler.run();
}

// Calling the main function
main()
    .then(() => console.log('Crawling completed.'))
    .catch((err) => console.error('An error occurred:', err));
