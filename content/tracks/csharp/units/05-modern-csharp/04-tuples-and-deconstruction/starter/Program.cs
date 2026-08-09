int[] temps = { 61, 54, 72, 66, 58 };

// 1. Write MinMax(int[] values) with a NAMED tuple return type:
//      (int Min, int Max) MinMax(int[] values)
//    One pass over the array, ONE return statement handing back both.
// 2. Deconstruct the call into two fresh variables:
//      (int min, int max) = MinMax(temps);
//    Print:  low {min}, high {max}      then:  swing: {max - min}
// 3. The classic swap — no temp variable:
//      string first = "Ada";  string second = "Grace";
//    Print "before: {first}, {second}", swap with ONE tuple assignment,
//    print "after: {first}, {second}".
