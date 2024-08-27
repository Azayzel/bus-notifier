using HtmlAgilityPack;
using Quartz;
using Quartz.Impl;
using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    private static readonly HttpClient client = new HttpClient();

    static async Task Main(string[] args)
    {
        // Define the job and trigger
        IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
        await scheduler.Start();

        IJobDetail job = JobBuilder.Create<CheckGoogleSheetJob>()
            .WithIdentity("googleSheetJob", "group1")
            .Build();

        // Schedule to run every weekday (Monday to Friday) at 3:58 PM
        ITrigger trigger = TriggerBuilder.Create()
            .WithIdentity("trigger1", "group1")
            .WithCronSchedule("0 58 15 ? * MON-FRI") // Cron expression for weekdays at 3:58 PM
            .Build();

        await scheduler.ScheduleJob(job, trigger);

        // Keep the console application running
        Console.WriteLine("Press [Enter] to close the application.");
        Console.ReadLine();
    }

    public class CheckGoogleSheetJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            try
            {
                await CheckGoogleSheetForCondition();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        private async Task CheckGoogleSheetForCondition()
        {
            // The URL of your Google Sheets document
            var url = "https://docs.google.com/spreadsheets/d/10IdwS_bOQno1riCwUKfRelvSQw00kX0RhWABL9sUbAo/htmlview#gid=168123441";

            // Make a GET request to fetch the HTML content of the Google Sheet
            var response = await client.GetStringAsync(url);

            // Load the HTML content into HtmlAgilityPack
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(response);

            // Get the current date in M/dd/YY format
            var now = DateTime.Now;
            var formattedDate = now.ToString("M/dd/yy");

            // Find the relevant rows and check for the condition
            var rows = htmlDocument.DocumentNode.SelectNodes("//tr");
            bool found911 = false;

            if (rows != null)
            {
                foreach (var row in rows)
                {
                    var cells = row.SelectNodes("td");
                    if (cells != null && cells.Count > 0)
                    {
                        var firstCell = cells[0].InnerText.Trim();
                        var timeDeparting = cells[^1].InnerText.Trim(); // ^1 is the last element

                        if (firstCell == "911" && !string.IsNullOrEmpty(timeDeparting))
                        {
                            found911 = true;
                            break;
                        }
                    }
                }
            }

            if (found911)
            {
                Console.WriteLine($"911 was found in the sheet for {formattedDate} and has a time departing.");
                // TODO: Complete Twilio integration
            }
            else
            {
                Console.WriteLine($"911 not found yet for {formattedDate}. Continuing to check...");
            }
        }
    }
}
