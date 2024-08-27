use chrono::Local;
use cron::Schedule;
use reqwest;
use scraper::{Html, Selector};
use std::str::FromStr;
use std::time::Duration;
use tokio::time;

async fn check_google_sheet_for_condition() -> Result<(), Box<dyn std::error::Error>> {
    // The URL of your Google Sheets document
    let url = "https://docs.google.com/spreadsheets/d/10IdwS_bOQno1riCwUKfRelvSQw00kX0RhWABL9sUbAo/htmlview#gid=168123441";

    // Make a GET request to fetch the HTML content of the Google Sheet
    let response = reqwest::get(url).await?.text().await?;

    // Parse the HTML content
    let document = Html::parse_document(&response);
    let row_selector = Selector::parse("tr").unwrap();

    // Get the current date in M/dd/YY format
    let now = Local::now();
    let formatted_date = now.format("%m/%d/%y").to_string();

    // Find the relevant rows and check for the condition
    let mut found_911 = false;
    for row in document.select(&row_selector) {
        let cell_selector = Selector::parse("td").unwrap();
        let cells: Vec<_> = row.select(&cell_selector).collect();
        
        if cells.len() > 0 {
            let first_cell = cells[0].inner_html().trim().to_string();
            let time_departing = cells.last().unwrap().inner_html().trim().to_string();

            if first_cell == "911" && !time_departing.is_empty() {
                found_911 = true;
                break;
            }
        }
    }

    if found_911 {
        println!("911 was found in the sheet for {} and has a time departing.", formatted_date);
        // TODO: Complete Twilio integration
    } else {
        println!("911 not found yet for {}. Continuing to check...", formatted_date);
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Schedule to run every weekday (Monday to Friday) from 3:58 PM to 4:00 PM
    let cron_expression = "0 58 15 * * 1-5";
    let schedule = Schedule::from_str(cron_expression)?;

    for datetime in schedule.upcoming(Local).take(60) {
        let now = Local::now();
        if now.hour() == 15 && now.minute() >= 58 {
            println!("Checking the sheet...");
            check_google_sheet_for_condition().await?;
        }
        time::sleep(Duration::from_secs(60)).await;
    }

    Ok(())
}
