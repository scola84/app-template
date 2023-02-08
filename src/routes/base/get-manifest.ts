import { fastify } from '../../resources/fastify.js'

fastify.route({
  handler: async (request, reply) => {
    await reply
      .header('Cache-Control', 'public, max-age=31536000000, immutable')
      .send({
        background_color: '#FFF',
        display: 'fullscreen',
        icons: [{
          purpose: 'any',
          sizes: '192x192',
          src: `/assets/images/icon-192.png?v=${String(reply.locals.version)}`,
          type: 'image/png'
        }, {
          purpose: 'maskable',
          sizes: '192x192',
          src: `/assets/images/icon-192.png?v=${String(reply.locals.version)}`,
          type: 'image/png'
        }, {
          purpose: 'any',
          sizes: '512x512',
          src: `/assets/images/icon-512.png?v=${String(reply.locals.version)}`,
          type: 'image/png'
        }, {
          purpose: 'maskable',
          sizes: '512x512',
          src: `/assets/images/icon-512.png?v=${String(reply.locals.version)}`,
          type: 'image/png'
        }],
        id: '/',
        name: reply.locals.name,
        short_name: reply.locals.name,
        start_url: '/',
        theme_color: '#000'
      })
  },
  method: 'GET',
  url: '/manifest.json'
})
