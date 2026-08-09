const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ping(name, ms, up = true) {
  await wait(ms);
  if (!up) throw new Error(`${name} down`);
  return `${name} ok`;
}

async function main() {
  const reports = await Promise.all([ping("api", 60), ping("db", 20), ping("cache", 40)]);
  console.log(reports.join(" | "));

  const fastest = await Promise.race([ping("api", 60), ping("db", 20), ping("cache", 40)]);
  console.log(`first answer: ${fastest}`);

  const results = await Promise.allSettled([ping("api", 60), ping("db", 20, false), ping("cache", 40)]);
  for (const r of results) {
    console.log(r.status === "fulfilled" ? r.value : `recovered: ${r.reason.message}`);
  }
}

main();
