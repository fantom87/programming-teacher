int[] rolls = { 4, 6, 1, 6, 3, 6, 2 };

// 1. Write:  int CountWhere(int[] values, Func<int, bool> keep)
//    Its own loop + counter — count every value where keep(value) is true.
//    No LINQ inside: the point is to BE the machinery once.
// 2. Store a lambda in a variable and pass it:
//      Func<int, bool> isSix = n => n == 6;
//    For the evens count, pass an inline lambda instead (n % 2 == 0).
// 3. Store a printer in an Action:
//      Action<string> announce = ...prints ">> " + the message...
//    and use it for BOTH banner lines.
// Output:
//   >> dice report
//   sixes: 3
//   evens: 5
//   >> done
