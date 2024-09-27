import Rejection from './rejection.js';

export default class Driver {
	constructor(app, services) {
		this.services = services;
		app.get('*', this.on_get.bind(this));
		app.post('*', this.on_post.bind(this));
	}

	on_get(request, response) {

		const path = request.path
					.replace(/\/+$/, '')
					.replace(/^\/+/, '');

		const names = path.split('/');
		const service_name = names.shift();
		const query_name = names.join('/');

		if (!this.services.has(service_name)) {
			response.status(404)
				.send(`Service '${service_name}' does not exist`);
			return;
		}

		const service = this.services.get(service_name);
		const query = new Message(query_name);

		try {
			service.answer(query);
			response.status(200).send('OK');
		} catch (r) {
			if (r instanceof Rejection) {
				response.status(400).send({
					code: r.code,
					reason: r.reason
				});
			} else {
				response.status(500).send({
					message: 'sorry'
				});
			}
		}
	}

	on_post(request, response) {
		const path = request.path
					.replace(/\/+$/, '')
					.replace(/^\/+/, '');

		const names = path.split('/');
		const service_name = names.shift();
		const command_name = names.join('/');

		if (!this.services.has(service_name)) {
			response.status(404)
				.send(`Service '${service_name}' does not exist`);
			return;
		}

		const content = request.body;

		const service = this.services.get(service_name);
		const command = new Message(command_name, content);
		try {
			service.execute(command);
			response.status(200).send('OK');
		} catch (r) {
			if (r instanceof Rejection) {
				response.status(400).send({
					code: r.code,
					reason: r.reason
				});
			} else {
				response.status(500).send({
					message: 'sorry'
				});
			}
		}
	}
}

class Message {
	constructor(name, content=null) {
		this.name = name;
		this.content = content;
	}
}
