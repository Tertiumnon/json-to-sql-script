const fs = require('fs');
const arg = require('arg');
const sql = require('./lib/sql');

const args = arg({
  // Types
  '--source': String,
  '--output': String,
  '--name': String,
  '--excludes': [String],
  // Aliases
  '-s': '--source',
  '-o': '--output',
  '-n': '--name',
  '-e': '--excludes',
});

const isArgsValid = () => {
  if (
    !(args['--source'] !== undefined
    && args['--output'] !== undefined
    && args['--name'] !== undefined)
  ) {
    throw new Error('Check your arguments.');
  }
  return true;
};

const main = () => {
  const content = fs.readFileSync(args['--source'], { encoding: 'utf8' });
  const data = JSON.parse(content);
  const items = data.data;
  if (items.length > 0) {
    let res = '';
    items.forEach((item) => {
      res += sql.insert(item, args);
    });
    fs.writeFile(args['--output'], res, (err) => {
      if (err) throw err;
      console.log(`File "${args['--output']}" has been saved!`);
    });
  }
};

if (isArgsValid()) {
  main();
}
