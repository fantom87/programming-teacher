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

// 1. loadUser(id) — async.
//      try:     const user = await fetchUser(id);
//               RETURN `${user.name} (${user.plan})`
//      catch:   RETURN `guest (${err.message})`
//      finally: print `lookup finished: ${id}`

// 2. main() — async: print await loadUser("ada"), then await
//    loadUser("zoe"). Call main() at the bottom.
