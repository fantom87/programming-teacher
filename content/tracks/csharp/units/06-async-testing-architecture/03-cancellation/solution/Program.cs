Console.WriteLine("== Downloader ==");

using CancellationTokenSource cts = new();
cts.CancelAfter(500);

try
{
    await Download(5, cts.Token);
    Console.WriteLine("download complete");
}
catch (OperationCanceledException)
{
    Console.WriteLine("download cancelled");
}
finally
{
    Console.WriteLine("cleanup: connection closed");
}

Console.WriteLine("done");

static async Task Download(int chunks, CancellationToken token)
{
    for (int i = 1; i <= chunks; i++)
    {
        await Task.Delay(200, token);
        Console.WriteLine($"chunk {i} saved");
    }
}
