# rust

## Setup and Explanation

You'll need to add dependencies in your Cargo.toml for the crates used in this code:
toml

```.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["blocking", "json"] }
scraper = "0.12.0"
cron = "0.7"
chrono = "0.4"
```

### HTTP Request and HTML Parsing

`reqwest` is used to make an HTTP GET request to fetch the HTML content.
`scraper` is used to parse the HTML content and extract data from the table rows.

### Date Handling

`chrono` is used to handle and format the current date.

### Scheduling

`cron` is used to schedule the checks, running every weekday (Monday to Friday) at 3:58 PM. The schedule expression `"0 58 15 * * 1-5"` is a cron expression.

### Tokio for Async Execution

The `tokio` runtime is used to handle the asynchronous operations and scheduling.

### Loop and Sleep

The program loops through the scheduled times, checking the Google Sheet and sleeping for 60 seconds between checks.
