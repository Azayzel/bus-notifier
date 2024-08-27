# ts

## Setup and Explanation

You need to install the required npm packages:

```bash
npm install axios cheerio node-cron
```

### HTTP Request and HTML Parsing

`axios` is used to make an HTTP GET request to fetch the HTML content.
`cheerio` is used to parse the HTML content and extract data from the table rows.

### Date Handling

The date is formatted using JavaScript's Date object.

### Scheduling

`node-cron` is used to schedule the checks. The cron expression `"58 15 * * 1-5"` schedules the job to run every weekday (Monday to Friday) at 3:58 PM.

### Job Execution

The cron job is scheduled with node-cron. It runs the `checkGoogleSheetForCondition` function at the specified time.

### Keeping the Process Alive

`process.stdin.resume()` is used to keep the Node.js process alive. Without it, the script would exit after scheduling the job.

## How to Run

- Create a new TypeScript project (or copy + paste code)
- Install the necessary npm packages (axios, cheerio, node-cron).
- Create a tsconfig.json file with appropriate TypeScript settings.
- Add the TypeScript code above to your index.ts or similar entry point file.
- Compile and run the TypeScript code using tsc and node:

```bash
tsc index.ts && node index.js
```
