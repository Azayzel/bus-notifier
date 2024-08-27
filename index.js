const axios = require("axios");
const cheerio = require("cheerio");
const schedule = require("node-schedule");

const accountSid = "ACb0c4382be8999ad0e28a5862ec212c6f";
const authToken = "b2e81183d813ca3ddef1085ca7b83d73";
const from = "+14344489986";
const to = ["+17038627672"]; //, "+15408414724"];

const client = require("twilio")(accountSid, authToken);

// The URL of your Google Sheets document
const url =
  "https://docs.google.com/spreadsheets/d/10IdwS_bOQno1riCwUKfRelvSQw00kX0RhWABL9sUbAo/htmlview#gid=168123441";

// Your Bus #
const bus = "911";

// Function to scrape the sheet and check for the condition
async function checkSheet() {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Get the current date in M/dd/YY format
    const date = new Date();
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;

    // Find the relevant column and rows
    const rows = $("tr").toArray();

    let found911 = false;
    let timeDeparted = "";
    rows.forEach((row) => {
      const cells = $(row).find("td");
      const firstCell = $(cells[0]).text().trim();
      const timeDeparting = $(cells[2]).text().trim();

      if (firstCell === bus && timeDeparting) {
        timeDeparted = timeDeparting;
        found911 = true;
      }
    });

    if (found911) {
      console.log(`sending sms`);
      for (let i = 0; i < to.length; i++) {
        await sendSms({
          from,
          to: to[i],
          body: `[${dateString}]: Bus ${bus} has left school at ${timeDeparted}.`,
        });
        if (i < to.length - 1) {
          await delay(1200); // Wait 1.2 seconds before sending the next SMS
        }
      }
      process.exit(0); // Stop further checks once the condition is met
    } else {
      console.log(`Bus ${bus} has not departed yet.`);
    }
  } catch (error) {
    console.error("Error fetching the Google Sheet:", error);
  }
}

const sendSms = async (message) => {
  return await client.messages
    .create(message, (err, msg) =>
      console.log(
        err ? "Successfully Sent messages" : `Failed to send messages: ${err}`
      )
    )
    .then(() =>
      console.log(`[${new Date().toLocaleDateString()}] Messages Sent`)
    )
    .catch((err) => console.warn(err));
};

// Schedule to run every weekday (Monday to Friday) from 3:58 PM until the condition is met
const job = schedule.scheduleJob("58 15 * * 1-5", function () {
  console.log("Checking the sheet...");
  checkSheet();
});

// You may need to schedule checks at intervals to catch updates
const intervalJob = schedule.scheduleJob("*/1 * * * *", function () {
  const date = new Date();
  if (
    date.getHours() >= 15 &&
    date.getMinutes() >= 58 &&
    date.getDay() >= 1 &&
    date.getDay() <= 5
  ) {
    console.log("Checking sheet at interval...");
    checkSheet();
  }
});

checkSheet();
