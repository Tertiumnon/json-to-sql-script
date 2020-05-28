const sql = {
  insert: (obj, args) => {
    let res = '';
    const excludes = args['--excludes'] !== undefined ? args['--excludes'].join('|') : [];
    const cols = [];
    const vals = [];
    if (obj instanceof Object) {
      Object.entries(obj).forEach((item) => {
        const key = item[0];
        const val = item[1];
        if (!(excludes.includes(key))) {
          if (val !== undefined || val !== null) {
            if (Array.isArray(val)) {
              val.forEach((valItm) => {
                res += sql.insert(valItm, {
                  '--main_name': `${args['--name']}`,
                  '--name': `${args['--name']}_${key}`,
                  '--ref_name': obj.name,
                });
              });
            } else if (val instanceof Object) {
              for (const [k, v] of Object.entries(val)) {
                cols.push(k);
                vals.push(JSON.stringify(v));
              }
            } else {
              cols.push(key);
              vals.push(JSON.stringify(val));
            }
          } else {
            const newObj = {};
            newObj.name = key;
            res += sql.insert(newObj, {
              '--main_name': `${args['--name']}`,
              '--name': `${args['--name']}_${key}`,
              '--ref_name': obj.name,
            });
          }
        }
      });
    } else {
      cols.push('name');
      vals.push(`${JSON.stringify(obj)}`);
    }
    if (args['--ref_name'] !== undefined) {
      const name = args['--main_name'].slice(0, -1);
      cols.push(`ref_${name}_name`);
      vals.push(`${JSON.stringify(args['--ref_name'])}`);
    }
    res += `INSERT IGNORE INTO ${args['--name']} `
    + `(${cols.join(',')}) VALUES (${vals.join(',')});\n`;
    return res;
  },
};

module.exports = sql;
