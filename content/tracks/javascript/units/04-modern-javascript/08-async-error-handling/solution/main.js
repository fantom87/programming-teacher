const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS = {
  ada: { name: "Ada", plan: "pro" },
  sam: { name: "Sam", plan: "free" },
};

// The fake network call — 40ms, then the user, or a thrown Error for
// unknown ids. Don't change it; build around it.
async function fetchUser(id) {
  await wait(40);
  const user = USERS[id];
  if (!user) throw new Error(`no such user: ${id}`);
  return user;
}

async function loadUser(id) {
  try {
    const user = await fetchUser(id);
    return `${user.name} (${user.plan})`;
  } catch (err) {
    return `guest (${err.message})`;
  } finally {
    console.log(`lookup finished: ${id}`);
  }
}

async function main() {
  console.log(await loadUser("ada"));
  console.log(await loadUser("zoe"));
}

main();
