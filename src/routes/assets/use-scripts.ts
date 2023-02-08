import { fastify } from '../../resources/fastify.js'
import fstatic from '@fastify/static'

await fastify.register(fstatic, {
  decorateReply: false,
  etag: false,
  immutable: true,
  maxAge: process.env.NODE_ENV === 'development' ? 0 : 31536000000,
  prefix: '/assets/scripts',
  root: `${process.cwd()}/dist/assets/scripts`
})
