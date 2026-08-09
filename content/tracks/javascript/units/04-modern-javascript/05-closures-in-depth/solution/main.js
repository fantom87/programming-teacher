function makeBank(opening) {
  let balance = opening;
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "declined";
      balance -= amount;
      return balance;
    },
    balance() {
      return balance;
    },
  };
}

const savings = makeBank(100);
console.log(savings.deposit(50));
console.log(savings.withdraw(200));
console.log(savings.withdraw(30));

function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const boot = once(() => {
  console.log("igniting!");
  return "engine on";
});
console.log(boot());
console.log(boot());
