const puppeteer = require("puppeteer");

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.toptenz.net/10-mind-blowing-facts-sound-like-bs-true.php");

    const events = await page.evaluate(() => {
        // Using Array.from to convert NodeList to Array
        const elements = Array.from(document.querySelectorAll("#post-58448 > div > div > h2> strong"));
        // Extracting text content from each element
        const textArray = elements.map(element => element.innerText);
        return textArray;
    });

    console.log(events); // Log the array obtained from page.evaluate

    await browser.close();
}

start();
