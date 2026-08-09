List<string> words = new List<string> { "orbit", "sun", "planetary", "moon", "asteroid" };

// 1. Build ONE query with query syntax:
//      from w in words  ...where the Length > 4...  orderby w  select w.ToUpper()
//    Store it in longWords. Do NOT call ToList().
// 2. foreach-print longWords.
// 3. words.Add("comet"); then print:  --- after adding comet ---
// 4. foreach-print longWords AGAIN — same variable, no rebuilding.
// 5. Print longWords.Count().
