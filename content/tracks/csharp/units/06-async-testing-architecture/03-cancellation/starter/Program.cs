// A download of five 200 ms chunks — but the user's patience runs out at
// 500 ms. Chunks 1 and 2 land; chunk 3 gets cut off mid-delay.
Console.WriteLine("== Downloader ==");

// 1. Create the owner half:
//      using CancellationTokenSource cts = new();
//      cts.CancelAfter(500);
// 2. Write the worker (bottom of the file):
//      static async Task Download(int chunks, CancellationToken token)
//    Loop i = 1..chunks: await Task.Delay(200, token), then print
//    $"chunk {i} saved". Pass the TOKEN into the delay — that's what makes
//    it stop the instant cancel fires. No try/catch inside the worker.
// 3. The caller reacts:
//      try       -> await Download(5, cts.Token); then print "download complete"
//      catch     -> OperationCanceledException SPECIFICALLY -> "download cancelled"
//      finally   -> "cleanup: connection closed"  (runs either way)
// 4. Print "done".
// Output:
//   == Downloader ==
//   chunk 1 saved
//   chunk 2 saved
//   download cancelled
//   cleanup: connection closed
//   done
