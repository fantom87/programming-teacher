const settings = { theme: "dark", volume: 7, muted: false };

const saveFile = '{"player":"Ada","level":12,"inventory":["rope","lantern"]}';

const saved = JSON.stringify(settings);
console.log(saved);

const loaded = JSON.parse(saveFile);
console.log(`${loaded.player} is level ${loaded.level}`);
console.log(loaded.inventory[0]);
