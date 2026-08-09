// From last lesson — the promisified timer, ready to use.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. step(name, ms) — an async function: await wait(ms), then RETURN
//    `${name} done`.

// 2. makeBreakfast() — async:
//      print "kitchen open"
//      await step("eggs", 60) and print the result
//      await step("toast", 40) and print the result
//      run step("juice", 30) and step("coffee", 50) through ONE
//        Promise.all, destructure, and print both results
//      print "breakfast served"

// 3. Call makeBreakfast(); print "(taking more orders)" on the file's
//    LAST line — it beats the eggs, because only the async function waits.
