// The door logged every badge scan today — including repeats.
string[] scans = { "ada", "grace", "ada", "linus", "grace", "ada" };

// 1. Create a HashSet<string> called visitors; foreach over scans, Add each.
// 2. Print:  6 scans, 3 unique visitors
//    (interpolate scans.Length and visitors.Count — don't type the numbers).
// 3. Print visitors.Contains("grace"), then visitors.Contains("brad").
// 4. Call visitors.Add("ada") once more, store the bool it returns, print it.
