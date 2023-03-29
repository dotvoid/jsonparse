# JSON Parse
## A JSON strucure parsing experiment

This is a hack. Jsonparse is an experiment to see if it would be possible to create a simple way to get an overview of the structure of a large JSON file. Originally created a few years ago during an afternoon hack.

It will count elements and give an overview of the JSON structure on stdout.

## Warning
**The code might contain errors, no typeScript, no tests, no error checking. This was an experiment!**

## Usage
```bash
cd jsonparse
npm i
node parse [filename] > outfile.json
```

## Example output

```json
{
    "name": "#root",
    "path": "#root",
    "type": "object",
    "count": 1,
    "children": [
        {
            "name": "products",
            "path": "#root.products",
            "type": "array",
            "count": 1,
            "children": [
                {
                    "name": "#object",
                    "path": "#root.products.#object",
                    "type": "object",
                    "count": 30,
                    "children": [
                        {
                            "name": "name",
                            "path": "#root.products.#object.name",
                            "type": "string",
                            "count": 30,
                            "properties": {
                                "minLength": 7,
                                "maxLength": 46
                            }
                        },
                        {
                            "name": "description",
                            "path": "#root.products.#object.description",
                            "type": "string",
                            "count": 30,
                            "properties": {
                                "minLength": 33,
                                "maxLength": 177
                            }
                        },
                        {
                            "name": "feedId",
                            "path": "#root.products.#object.productId",
                            "type": "number",
                            "count": 30,
                            "properties": {
                                "min": 20203,
                                "max": 20203
                            },
                            "subtype": "integer"
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Author
Danne Lundqvist

## License

BSD - free to use any way you want. Ideas or tips on other projects are welcome!