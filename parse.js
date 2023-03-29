const fs = require('fs')
const JsonParser = require('./classes/JsonParser')

if (process.argv.length !== 3) {
    console.warn("USAGE: nnode jsonparse file.json\n")
    return
}

const filePath = process.argv[2]

fs.readFile(filePath, 'utf8', function (err, data) {
    const jsonParser = new JsonParser({
        parsers: {
            string: [
                {
                    path: '#root.data.items.#object.dates',
                    match: (name, path, value) => {
                        return !isNaN(Date.parse(value))
                    },
                    parse: (value, node) => {
                        const ts = new Date(value)
                        return {
                            subType: 'ISODate',
                            value: ts,
                            properties: {
                                min: !node.properties.min || node.properties.min > ts ? ts : node.properties.min,
                                max: !node.properties.max || node.properties.max < ts ? ts : node.properties.max
                            }
                        }
                    }
                }
            ]
        }
    })

    console.log(
        JSON.stringify(
            jsonParser.parse(data),
            null,
            4
        )
    )
})