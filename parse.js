const fs = require('fs')
const JsonParser = require('./classes/JsonParser')

fs.readFile('./examples/simpleevents.json', 'utf8', function (err, data) {
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


// fs.readFile('./examples/package-lock.json', 'utf8', function (err, data) {
//     const jsonParser = new JsonParser({
//         parsers: {
//             object: [
//                 {
//                     path: '#root.dependencies',
//                     Map: () => true
//                 },
//                 {
//                     // Does not work
//                     path: '#root.dependencies.#object.requires',
//                     Map: () => true
//                 },
//                 {
//                     // Does not work
//                     path: '#root.dependencies.#object.dependencies',
//                     Map: () => true
//                 }
//             ]
//         }
//     })

//     console.log(
//         JSON.stringify(
//             jsonParser.parse(data),
//             null,
//             4
//         )
//     )
// })
