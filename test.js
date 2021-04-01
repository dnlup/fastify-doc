'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const { Sampler, errors } = require('@dnlup/doc')
const plugin = require('.')

test('invalid options', t => {
  const fastify = Fastify()
  return t.rejects(fastify.register(plugin, {
    sampleInterval: -1
  }), new errors.InvalidArgumentError('sampleInterval must be > 1, received -1'))
})

test('valid options', t => {
  const fastify = Fastify()
  return t.resolves(fastify.register(plugin))
})

test('metrics decorator', async t => {
  const fastify = Fastify()
  fastify.register(plugin, {
    sampleInterval: 100,
    unref: false
  })
  await fastify.ready()

  t.ok(fastify.metrics instanceof Sampler)

  await new Promise((resolve) => {
    fastify.metrics.once('sample', () => {
      resolve()
    })
  })

  t.ok(typeof fastify.eventLoopUtilizationSupported === 'boolean')
  t.ok(typeof fastify.resourceUsageSupported === 'boolean')
  t.ok(typeof fastify.gcFlagsSupported === 'boolean')

  await fastify.close()
})
