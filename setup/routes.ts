import { defineRoutesSetup } from '@slidev/types'

export default defineRoutesSetup((routes) => {
  for (const route of routes) {
    if (route.path === '')
      route.redirect = { path: '/cover' }
    else if (route.path === '/presenter')
      route.redirect = { path: '/presenter/cover' }
  }
  return routes
})
