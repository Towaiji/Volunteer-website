const fs = require('fs');
const { Cluster } = require('puppeteer-cluster');

const baseURL = "https://www.volunteermatch.org";
const urls = [
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=2&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=3&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=4&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=5&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=6&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=7&o=distance",
  "https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada&p=8&o=distance"
];

(async () => {
  // Launch a new Puppeteer Cluster
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8, // Number of concurrent pages
  });

  // Array to store the results from all pages
  const results = [];

  // Define the task to be performed by each worker
  await cluster.task(async ({ page, data: url }) => {
    // Go to the page
    await page.goto(url);

    // Extract titles and locations from the page
    const events = await page.evaluate(baseURL => {
      const titles = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > h3 > a"));
      const locations = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > div > div.org-srp-orgs__loc.sb.i-block"));

      // Combine titles and locations into a single array of arrays
      const combined = titles.map((titleElement, index) => {
        let titleText = titleElement.innerText.trim();
        // Remove leading number and dot (if present)
        titleText = titleText.replace(/^\d+\.\s*/, '');
        let href = baseURL + titleElement.getAttribute('href').trim(); // Concatenate base URL with href
        href = href.replace('.jsp', ''); // Remove .jsp from the href
        return [
          `"${titleText}"`, // Enclose title in quotes
          `"${href}"`, // Enclose href in quotes
          `"${locations[index] ? locations[index].innerText.trim() : 'Location not available'}"` // Enclose location in quotes
        ];
      });

      return combined;
    }, baseURL);

    // Add the result to the results array
    results.push(...events); // Flatten results into a single array
  });

  // Queue up all the URLs to be processed
  for (const url of urls) {
    await cluster.queue(url);
  }

  // Wait until all tasks are complete
  await cluster.idle();
  await cluster.close();

  // Save data as CSV format
  const csvContent = results.map(row => row.join(',')).join('\n');
  fs.writeFileSync('scraped_data.csv', csvContent);

  console.log('Scraped data has been saved to scraped_data.csv');
})();
