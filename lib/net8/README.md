# net8.0

Here's how you could implement the same functionality in a .NET 8 application using C#. This version uses HttpClient for making HTTP requests, HtmlAgilityPack for HTML parsing, and Quartz.NET for scheduling.

## Setup and Explanation

You'll need to add dependencies to your .csproj file for the following packages:
xml

```xml
<ItemGroup>
  <PackageReference Include="HtmlAgilityPack" Version="1.11.46" />
  <PackageReference Include="Quartz" Version="3.5.0" />
</ItemGroup>
```

### HTTP Request and HTML Parsing

`HttpClient` is used to make an HTTP GET request to fetch the HTML content.
`HtmlAgilityPack` is used to parse the HTML content and extract data from the table rows.

### Date Handling

The current date is formatted using DateTime.Now.ToString("M/dd/yy").

### Scheduling

Quartz.NET is used to schedule the checks. The cron expression "0 58 15 ? * MON-FRI" schedules the job to run every weekday (Monday to Friday) at 3:58 PM.

### Job Execution

The `CheckGoogleSheetJob` class implements IJob from Quartz.NET. The Execute method contains the logic to check the Google Sheet.
Keeping the Application Running:

The `Console.ReadLine()` at the end keeps the console application running so that the scheduler can continue to execute jobs.

## How to Run

- Create a new .NET 8 console project.
- Add the necessary NuGet packages (HtmlAgilityPack and Quartz.NET).
- Replace the content of Program.cs with the code above.
- Run the project. The program will check the Google Sheet according to the schedule you defined.
