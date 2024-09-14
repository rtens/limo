import Driver from '../../src/driver.js'

export default class Fixture {
  constructor() {  
    this.app = new App(this)
    this.services = new ServiceContainer()

    new Driver(this.app, this.services)
  }

  service(name, service) {
    this.services.services[name] = service
  }

  post(pattern, path) {
    this.response = {}
    this.app.handlers[pattern](
      {path},
      new Response(this)
    )
  }
}

class App {
  constructor(fixture) {
    this.fix = fixture
    this.handlers = {}
  }
  
  post(pattern, handler) {
    this.handlers[pattern] = handler
  }
}

class Response {
  constructor(fixture) {
    this.fix = fixture
  }
  
  status(status) {
    this.fix.response.status = status
    return this
  }

  send(content) {
    this.fix.response.content = content
  }
}

class ServiceContainer {
  constructor() {
    this.services = {}
  }

  has(name) {
    return name in this.services
  }

  get(name) {
    return this.services[name]
  }
}
