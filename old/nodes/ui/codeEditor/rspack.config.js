/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')
const rspackBaseConfig = require('../../rspackBase.config')

const nodeName = pJson.name
var outputBuildPath = path.resolve(__dirname, `../../../../build/old_${nodeName}`)

module.exports = (env) => {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project)

	return config
}
