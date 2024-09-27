import Driver from '../../src/driver.js';

export default class Fixture {
	constructor() {
		this.app = new App(this);
		this.services = new ServiceContainer();

		new Driver(this.app, this.services);
	}

	mockService(name) {
		this.services.services[name] = new Service();
	}

	service(name) {
		return this.services.services[name];
	}

	post(pattern, path, body=null) {
		this.response = {};
		this.app.handlers[pattern](
			{path, body},
			new Response(this)
		);
	}
}

class App {
	constructor(fixture) {
		this.fix = fixture;
		this.handlers = {};
	}

	post(pattern, handler) {
		this.handlers[pattern] = handler;
	}
}

class Service {
	execute(command) {
		this.executed = command;
	}
}

class Response {
	constructor(fixture) {
		this.fix = fixture;
	}

	status(status) {
		this.fix.response.status = status;
		return this;
	}

	send(content) {
		this.fix.response.content = content;
	}
}

class ServiceContainer {
	constructor() {
		this.services = {};
	}

	has(name) {
		return name in this.services;
	}

	get(name) {
		return this.services[name];
	}
}
