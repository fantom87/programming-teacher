# Objects

An object groups related values under one name. Where an array is a numbered list, an object is a set of labeled slots — perfect for describing *one thing* with several properties.

## Creating and reading

```js
const user = {
  name: "Ada",
  age: 36,
  isAdmin: true,
};

user.name;        // "Ada" — dot notation
user["age"];      // 36 — bracket notation (useful when the key is in a variable)
```

Each `label: value` pair is called a **property**. Labels are called **keys**.

## Changing objects

```js
user.age = 37;            // update a property
user.city = "London";     // add a new one
delete user.isAdmin;      // remove one
```

Like arrays, an object declared with `const` can still have its properties changed.

## Objects inside objects

Real data nests. Reach into it with chained dots:

```js
const post = {
  title: "Hello world",
  author: {
    name: "Sam",
    followers: 120,
  },
  tags: ["intro", "js"],
};

post.author.name;   // "Sam"
post.tags[0];       // "intro"
```

If a property might be missing, **optional chaining** (`?.`) avoids a crash:

```js
post.editor?.name;   // undefined — no error, even though editor doesn't exist
```

## Destructuring: unpacking shortcuts

Pull properties into their own variables in one line:

```js
const { title, author } = post;
console.log(title);         // "Hello world"
console.log(author.name);   // "Sam"
```

## Looping over an object

```js
const prices = { coffee: 3, tea: 2.5 };

Object.keys(prices);     // ["coffee", "tea"]
Object.values(prices);   // [3, 2.5]

for (const [item, price] of Object.entries(prices)) {
  console.log(`${item} costs ${price}`);
}
```

## Copying with spread

```js
const updated = { ...user, age: 40 };   // copy user, but with age 40
```

Objects are everywhere in JavaScript — JSON data from servers, configuration, even functions live on objects. Get comfortable poking at them in the console.
