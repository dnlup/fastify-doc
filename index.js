'use strict'

const fp = require('fastify-plugin')
const doc = require('@dnlup/doc')

function plugin (fastify, opts, done) {
  try {
    const sampler = doc(opts)
    fastify.decorate('metrics', sampler)
    fastify.addHook('onClose', (instance, done) => {
      sampler.stop()
      done()
    })
    done()
  } catch (error) {
    done(error)
  }
}

exports.plugin = plugin
exports.register = fp(plugin, {
  fastify: '^3.0.0',
  name: '@dnlup/fastify-doc'
})
