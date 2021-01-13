'use strict'

const fp = require('fastify-plugin')
const doc = require('@dnlup/doc')

function plugin (fastify, opts, done) {
  try {
    fastify.decorate('eventLoopUtilizationSupported', doc.eventLoopUtilizationSupported)
    fastify.decorate('resourceUsageSupported', doc.resourceUsageSupported)
    fastify.decorate('gcFlagsSupported', doc.gcFlagsSupported)

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

module.exports = fp(plugin, {
  fastify: '^3.0.0',
  name: '@dnlup/fastify-doc'
})
