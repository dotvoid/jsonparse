class JsonParser {
    constructor({parsers = null} = null) {
        this._registry = {}
        this.parsers = parsers
    }

    parse(data) {
        return this._parseObject(
            '#root',
            JSON.parse(data)
        )
    }

    _getParser(type, name, value, path, parent) {
        if (!this.parsers || !Array.isArray(this.parsers[type])) {
            return null
        }

        const parsers = this.parsers[type]
        for (let n = 0; n < parsers.length; n++) {
            if (parsers[n].path === path) {
                if (parsers[n].match(name, path, value)) {
                    return parsers[n]
                }
            }
        }
    }

    _parseValue(name, value, path = '', parent = null) {
        if (Array.isArray(value)) {
            return this._parseArray(name, value, path, this._getParser('array', name, value, path, parent))
        }

        const valueType = typeof value
        if (valueType === 'number') {
            return this._parseNumber(name, value, path, this._getParser('number', name, value, path, parent))
        }
        else if (valueType === 'string') {
            return this._parseString(name, value, path, this._getParser('string', name, value, path, parent))
        }
        else if (valueType === 'boolean') {
            return this._parseBoolean(name, value, path, this._getParser('boolean', name, value, path, parent))
        }
        else if (valueType === 'object') {
            return this._parseObject(name, value, path, this._getParser('object', name, value, path, parent))
        }

        throw new Error(`Tried parsing ${path}.${name} which has an invalid JSON type`)
    }

    _parseArray(name, array, path = null, parser = null) {
        const nodeName = name || '#array'
        const nodePath = path ? `${path}.${nodeName}` : nodeName

        let node = this._registry[nodePath]
        if (!node) {
            node = this._addNode(
                nodePath,
                {
                    name: nodeName,
                    path: nodePath,
                    type: 'array',
                    count: 0,
                    children: []
                }
            )
        }

        for (let value of array) {
            const childNode = this._parseValue(null, value, nodePath)
            if (childNode) {
                node.children.push(childNode)
            }
        }

        node.count++
        if (node.count === 1) {
            return node
        }
    }

    _parseObject(name, object, path = null, parser = null) {
        let nodeName = name || '#object'
        let nodePath = path ? `${path}.${nodeName}` : `${nodeName}`

        let node = this._registry[nodePath]
        if (!node) {
            node = this._addNode(
                nodePath,
                {
                    name: nodeName,
                    path: nodePath,
                    type: 'object',
                    count: 0,
                    children: []
                }
            )
        }

        for (let name in object) {
            const childNode = this._parseValue(name, object[name], nodePath)
            if (childNode) {
                node.children.push(childNode)
            }
        }

        node.count++
        if (node.count === 1) {
            return node
        }
    }

    _parseString(name, string, path, parser = null) {
        const nodeName = name || '#string'
        const nodePath = `${path}.${nodeName}`

        let node = this._registry[nodePath]
        if (!node) {
            node = this._addNode(
                nodePath,
                {
                    name: nodeName,
                    path: nodePath,
                    type: 'string',
                    count: 0,
                    properties: {
                        minLength: string.length,
                        maxLength: string.length
                    }
                }
            )
        }

        if (parser) {
            const parsedValue = parser.parse(string, node)
            node.subType = parsedValue.subType
            node.properties = parsedValue.properties
        }
        else {
            const strLen = string.length
            if (node.properties.minLength > strLen) {
                node.properties.minLength = strLen
            }
            else if (node.properties.maxLength < strLen) {
                node.properties.maxLength = strLen
            }
        }

        node.count++
        if (node.count === 1) {
            return node
        }
    }

    _parseNumber(name, number, path, parser = null) {
        const nodeName = name || '#number'
        const nodePath = `${path}.${nodeName}`

        let node = this._registry[nodePath]
        if (!node) {
            node = this._addNode(
                nodePath,
                {
                    name: nodeName,
                    path: nodePath,
                    type: 'number',
                    count: 0,
                    properties: {
                        min: number,
                        max: number
                    }
                }
            )
        }

        // If float is encountered once, field is considered to be float, stop checking
        if (node.subtype !== 'float') {
            if (Number.parseInt(number) === number) {
                node.subtype = 'integer'
            }
            else {
                node.subtype = 'float'
            }
        }

        if (node.properties.min > number) {
            node.properties.min = number
        }
        else if (node.properties.max < number) {
            node.properties.max = number
        }

        node.count++
        if (node.count === 1) {
            return node
        }
    }

    _parseBoolean(name, boolean, path, parser = null) {
        const nodeName = name || '#boolean'
        const nodePath = `${path}.${nodeName}`

        if (this._registry[nodePath]) {
            this._registry[nodePath].count++
        }
        else {
            return this._addNode(
                nodePath,
                {
                    name: nodeName,
                    path: nodePath,
                    type: 'boolean',
                    count: 1
                }
            )
        }
    }

    _addNode(nodePath, node) {
        this._registry[nodePath] = node
        return node
    }

    _addWarning(node, warning) {
        if (!Array.isArray(node.warnings)) {
            node.warnings = []
        }

        node.warnings.push(warning)
    }
}

module.exports = JsonParser
