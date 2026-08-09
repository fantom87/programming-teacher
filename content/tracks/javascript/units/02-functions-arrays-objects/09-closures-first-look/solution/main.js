function makeCounter() {
  let count = 0;
  return () => {
    count = count + 1;
    return count;
  };
}

const clicks = makeCounter();
const visits = makeCounter();
console.log(clicks());
console.log(clicks());
console.log(visits());

function makeTagger(tag) {
  return (message) => `[${tag}] ${message}`;
}

const warn = makeTagger("WARN");
console.log(warn("low battery"));
