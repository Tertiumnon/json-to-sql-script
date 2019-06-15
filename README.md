# JSON to SQL script

This package creates SQL script from JSON-file.

## Install

```bash
npm i -g json-to-sql-script
```

## Arguments

```node
'-s': '--source' // Source file path
'-o': '--output' // Output file path
'-n': '--name' // Main table name
'-e': '--excludes' // Exclude property names
```

## Example

```bash
json-to-sql-script -s 'input.json' -o 'output.sql' -n 'items' -e 'date_created|date_modified'
```

## Example output

```json
{
  "data": [
    {
      "name": "Rye bread",
      "description": "Rye bread is a type of bread made with various proportions of flour from rye grain."
    },
    {
      // next object
    }
  ]
}
```

```sql
INSERT IGNORE INTO items (name,description) VALUES ("Rye bread","Rye bread is a type of bread made with various proportions of flour from rye grain.");
```

If JSON object includes arrays or objects, for example:

```json
{
  "data": [
    {
      "name": "Rye bread",
      "description": "Rye bread is a type of bread made with various proportions of flour from rye grain.",
      "components": [
        {
          "name": "Salt"
        },
        {
          "name": "Sugar"
        }
      ]
    },
    {
      // next object
    }
  ]
}
```

Script adds rows with ref_{{table_name}}_name:

```sql
INSERT IGNORE INTO items_components (name,ref_item_name) VALUES ("Salt","Rye bread.");
```
