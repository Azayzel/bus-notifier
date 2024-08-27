import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";

// The URL of your Google Sheets document
const url =
  "https://docs.google.com/spreadsheets/d/10IdwS_bOQno1riCwUKfRelvSQw00kX0RhWABL9sUbAo/htmlview#gid=168123441";

// Function to scrape the sheet and check for the condition
async function checkGoogleSheetForCondition(): Promise<void> {
  try {
    // Make a GET request to fetch the HTML content of the Google Sheet
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into cheerio
    const $ = cheerio.load(html);

    // Get the current date in M/dd/YY format
    const date = new Date();
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;

    // Find the relevant rows and check for the condition
    const rows = $("tr").toArray();
    let found911 = false;

    rows.forEach((row) => {
      const cells = $(row).find("td");
      const firstCell = $(cells[0]).text().trim();
      const timeDeparting = $(cells).last().text().trim();

      if (firstCell === "911" && timeDeparting) {
        found911 = true;
      }
    });

    if (found911) {
      console.log(
        `911 was found in the sheet for ${formattedDate} and has a time departing.`
      );
      // Optional: Add any other actions you want to perform here
    } else {
      console.log(
        `911 not found yet for ${formattedDate}. Continuing to check...`
      );
    }
  } catch (error) {
    console.error("Error fetching or parsing the Google Sheet:", error);
  }
}

// Schedule to run every weekday (Monday to Friday) at 3:58 PM
cron.schedule(
  "58 15 * * 1-5",
  async () => {
    console.log("Checking the sheet...");
    await checkGoogleSheetForCondition();
  },
  {
    scheduled: true,
    timezone: "America/New_York", // Adjust the timezone as needed
  }
);

// Keep the process alive
process.stdin.resume();
