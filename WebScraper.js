const { Cluster } = require('puppeteer-cluster');

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
  // Launch the cluster with concurrency settings
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8, // Maximum number of pages to open in parallel
  });

  // Array to hold all results
  const results = [];

  // Define the task that will be run by the cluster
  await cluster.task(async ({ page, data: url }) => {
    // Go to the URL
    await page.goto(url);

    // Extract titles and locations from the page
    const events = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > h3 > a"));
      const locations = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > div > div.org-srp-orgs__loc.sb.i-block"));

      const titleArray = titles.map(titleElement => ({
        title: titleElement.innerText.trim(),
        href: titleElement.getAttribute('href')
      }));

      const locationArray = locations.map(locationElement => locationElement.innerText.trim());

      return { titles: titleArray, locations: locationArray };
    });

    // Add the extracted data to the results array
    results.push(events);
  });

  // Queue all URLs for processing
  for (const url of urls) {
    await cluster.queue(url);
  }

  // Wait for all pages to be processed and close the cluster
  await cluster.idle();
  await cluster.close();

  // Log the aggregated results
  console.log(results);
})();
