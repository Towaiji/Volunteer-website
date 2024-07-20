const puppeteer = require("puppeteer");

async function start() {
    const browser = await puppeteer.launch(); // Launches Browser
    const page = await browser.newPage();
    await page.goto("https://www.volunteermatch.org/search/orgs.jsp?r=20.0&l=Mississauga%2C+ON%2C+Canada"); // Goes to page

    const events = await page.evaluate(() => {
        const titles = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > h3 > a")); // Collects all the titles 
        const locations = Array.from(document.querySelectorAll("div.col-sm-10.col-md-6.order-1-sm > div > div.org-srp-orgs__loc.sb.i-block")); // Collects all the locations
    
        const titleArray = titles.map(titleElement => ({  // Places the title and the link in the same array
            title: titleElement.innerText.trim(),
            href: titleElement.getAttribute('href')
        }));
    
        const locationArray = locations.map(locationElement => locationElement.innerText.trim()); 
    
        return { titles: titleArray, locations: locationArray };
    });
    
  

    console.log("Titles:", events.titles); // Log the titles array
    console.log("Locations:", events.locations); // Log the locations array

    await browser.close();
}

start();