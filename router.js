import app from './app.js'
import { readdir, stat as getStat } from 'node:fs/promises'
import { join, parse } from 'path'

const ROUTE_FOLDER = '/app/api'
const path = join(process.cwd(), ROUTE_FOLDER)

const allowedHttpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
]

try {
  const files = (await readdir(path, {
    recursive: true
  }))

  const noDirectories = await filterDirectories(files)
  const onlyRouteFiles = await filterNonRouteFiles(noDirectories)
  
  for (const file of onlyRouteFiles) {
    const exported = await import('./' + join(ROUTE_FOLDER, file))
    const route = parse(file).dir
    const methods = Object.keys(exported)

    methods
      .filter(m => allowedHttpMethods.includes(m))
      .forEach(method => {
        const lower = s => s.toLowerCase()
        
        app[lower(method)] (`/${route}`, exported[method])
      })
  }
} catch (err) {
  console.error(err)
}

async function filterDirectories (files) {
  const passed = []
  for (const file of files) {
    const stat = await getStat(join(path, file))
    if (!stat.isDirectory()) {
      passed.push(file)
    }
  }
  return passed
}

async function filterNonRouteFiles (files) {
  const passed = []
  for (const file of files) {
    if (parse(file).name == 'route') {
      passed.push(file)
    }
  }
  return passed
}

app.listen(3000, () => {
  console.log(`Server listening at: http://localhost:3000`)
})