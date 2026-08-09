// Top-level code (write the types below first, then use them here):
// 1. Make new Box<int>(38) and new Box<string>("keep going");
//    print each box's Describe().
// 2. Print Max(3, 11), then Max("apple", "pear").

// Define below:
//   T Max<T>(T a, T b) where T : IComparable<T>
//       — return whichever argument CompareTo says is bigger
//
//   class Box<T>
//       — constructor takes a T and stores it in a Value property
//       — Describe() returns $"Box holding {Value}"
