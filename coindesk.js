import puppeteer from "puppeteer";
import {writeFileSync} from "fs";
import {parse} from 'json2csv';

const saveAsCSV = (csvData) => {
    const csv = parse(csvData)
    writeFileSync('result.csv', csv);
}

const getQuotes = async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C://chrome-win/chrome.exe',
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // await page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.coindesk.com/newsletters/");

    await page.waitForTimeout(50000);
    
    let results = [];

    results = results.concat(await extractedEvaluateCall(page));

    // Close the browser
    await browser.close();

    saveAsCSV(results);
};

async function extractedEvaluateCall(page) {
    // Get page data
    const quotes = await page.evaluate(() => {
        const quoteList = document.querySelectorAll("div.Box-sc-1hpkeeg-0 div.newslettersstyles__CardWrapper-sc-1gi5srn-0");

        return Array.from(quoteList).map((quote) => {
            const url = quote.querySelector("h4 a").href;
            const title = quote.querySelector("h4 a").innerText;
            const date = quote.querySelector("p.hqDqYo").innerText;
            const content = quote.querySelector("p.bYmaON").innerText;

            return { title, date, content, url };
        });
    });

    return quotes;
}

// Start the scraping
getQuotes();