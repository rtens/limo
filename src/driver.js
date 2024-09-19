export default class Driver {
  constructor(app, services) {
    this.services = services
    app.post('*', this.on_post.bind(this))
  }

  on_post(request, response) {
    const path = request.path
          .replace(/\/+$/, '')
          .replace(/^\/+/, '')

    const [service_name, command_name] = path.split('/')

    if (!this.services.has(service_name)) {
      response.status(404)
  .send(`Service '${service_name}' does not exist`)
      return
    }

    const service = this.services.get(service_name)
    service.execute(new Command(command_name))

    response.status(200).send('OK')
  }
}

class Command {
  constructor(name) {
    this.name = name
  }
}
