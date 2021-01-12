# fastify-doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Ffastify-doc.svg)](https://badge.fury.io/js/%40dnlup%2Ffastify-doc)
![Tests](https://github.com/dnlup/fastify-traps/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/dnlup/fastify-doc/branch/next/graph/badge.svg?token=EX89KNVVSY)](https://codecov.io/gh/dnlup/fastify-doc)
[![Known Vulnerabilities](https://snyk.io/test/github/dnlup/fastify-doc/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dnlup/fastify-doc?targetFile=package.json)

> A Fastify plugin for sampling process metrics.

It uses the module [`@dnlup/doc`](https://github.com/dnlup/doc) behind the scenes.

It decorates the `Fastify` instance with a [`Sampler`](https://github.com/dnlup/doc#class-docsampler)
instance that you can use to get process metrics.

A new sample of the metrics is available when the `Sampler` emits a `sample` event.

See [`@dnlup/doc`](https://github.com/dnlup/doc#class-docsampler)
documentation for more details.

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
  * [Register in the same context](#register-in-the-same-context)
  * [Register in an encapsulated context](#register-in-an-encapsulated-context)
  * [Plugin options](#plugin-options)
- [Decorators](#decorators)
  * [`metrics`](#metrics)
- [Hooks](#hooks)
  * [`onClose`](#onclose)
- [License](#license)

<!-- tocstop -->

## Install

```bash
npm i @dnlup/fastify-doc
```

## Usage

### Register in the same context

> Uses [fastify-plugin](https://github.com/fastify/fastify-plugin) and it's the most common registration method.

```js
const fastify = require('fastify')()
const plugin = require('@dnlup/fastify-doc')

fastify.register(plugin.register)

fastify.metrics.on('sample', () => {
  // sendCpuUsage(fastify.metrics.cpu.usage)
  // ...send other metrics as well
})

fastify.get('/', (request, reply) => {
  reply.send({ ok: true })
})

fastify.listen(3000)
```

### Register in an encapsulated context

> If you don't want to expose this plugin to the outer context.

```js
const fastify = require('fastify')()
const { plugin } = require('@dnlup/fastify-doc')

fastify.register(function myCustomPlugin (instance, opts, done) {
  const myOpts = {}
  instance.register(plugin, myOpts)
  // ...my custom logic
  instance.metrics.on('sample', () => {
    // sendCpuUsage(fastify.metrics.cpu.usage)
    // ...send other metrics as well
  })
  done()
})

fastify.get('/', (request, reply) => {
  reply.send({ ok: true })
})

fastify.listen(3000)
```

### Plugin options

The options are the same of [`@dnlup/doc`](https://github.com/dnlup/doc#docoptions) (reported here for convenience):

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-sample) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to track the event loop delay and this allows to increase the default `sampleInterval`.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v12.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `eventLoopOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `resourceUsage` `<boolean>`: enable [resourceUsage](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_resourceusage) metric. **Default:** `false`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `eventLoopUtilization` `<boolean>`: enable [eventLoopUtilization](https://nodejs.org/docs/latest-v14.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) metric. **Default:** `true` on Node versions that support it.
    * `memory` `<boolean>`: enable memory metric. **Default:** `true`.
    * `gc` `<boolean>`: enable garbage collection metric. **Default:** `false`.
    * `activeHandles` `<boolean>`: enable active handles collection metric. **Default:** `false`.

## Decorators

### `metrics`

* [`<Sampler>`](https://github.com/dnlup/doc#class-docsampler)

A `Sampler` instance.

## Hooks

### `onClose`

Stops the `Sampler` instance when closing the server.

## License

[ISC](./LICENSE)
