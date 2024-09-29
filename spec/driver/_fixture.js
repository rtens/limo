import Driver from '../../src/driver.js';

export default class Fixture {
	constructor() {
		this.app = new App(this);
		this.services = new ServiceContainer();
		this.tracer = new Tracer();

		new Driver(this.app, this.services, this.tracer);
	}

	mockService(name) {
		const service = new Service();
		this.services.services[name] = service;
		return service;
	}

	service(name) {
		return this.services.services[name];
	}

	get(pattern, path, query={}, headers={}) {
		this.response = new Response();
		this.app.get_handlers[pattern](
			{path, query, headers},
			this.response
		);
	}

	post(pattern, path, body=null, headers={}) {
		this.response = new Response();
		this.app.post_handlers[pattern](
			{path, body, headers},
			this.response
		);
	}

	nextTraces(...traces) {
		this.tracer.traces = traces;
	}
}

class App {
	constructor(fixture) {
		this.fix = fixture;
		this.get_handlers = {};
		this.post_handlers = {};
	}

	get(pattern, handler) {
		this.get_handlers[pattern] = handler;
	}

	post(pattern, handler) {
		this.post_handlers[pattern] = handler;
	}
}

class Service {

	answer(query) {
		this.answered = query;
		if (this.answerer) {
			return this.answerer(query);
		}
		return null;
	}

	execute(command) {
		this.executed = command;
		if (this.executer) {
			this.executer(command);
		}
	}

	answers(answerer) {
		this.answerer = answerer;
	}

	executes(executer) {
		this.executer = executer;
	}
}

class Response {

	status(status) {
		this.status = status;
		return this;
	}

	send(content) {
		this.content = content;
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

class Tracer {
	constructor() {
		this.traces = [];
	}

	next() {
		return this.traces.shift() || 'random';
	}
}
