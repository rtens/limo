import Rejection from './rejection.js';

export default class Driver {
	constructor(app, services) {
		this.services = services;
		app.get('*', this.onGet.bind(this));
		app.post('*', this.onPost.bind(this));
	}

	onGet(request, response) {
		this._handleMessage(
			request,
			response,
			() => null,
			(service, query) => {
				const answer = service.answer(query);
				response.status(200).send(answer);
			}
		);
	}

	onPost(request, response) {
		this._handleMessage(
			request,
			response,
			() => request.body,
			(service, command) => {
				service.execute(command);
				response.status(200).send('OK');
			}
		);
	}

	_handleMessage(request, response, getContent, handler) {
		const path = request.path
					.replace(/\/+$/, '')
					.replace(/^\/+/, '');

		const names = path.split('/');
		const service_name = names.shift();
		const message_name = names.join('/');

		if (!this.services.has(service_name)) {
			response.status(404)
				.send(`Service '${service_name}' does not exist`);
			return;
		}

		const content = request.body;

		const service = this.services.get(service_name);
		const message = new Message(message_name, getContent());

		try {
			handler(service, message);
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
