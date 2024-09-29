import Rejection from './rejection.js';

export default class Driver {
	constructor(app, services, tracer) {
		this.services = services;
		this.tracer = tracer;
		app.get('*', this.onGet.bind(this));
		app.post('*', this.onPost.bind(this));
	}

	onGet(request, response) {
		this._handleMessage(
			request,
			response,
			() => request.query,
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
		const message = new Message(
			this.tracer.next(),
			message_name,
			getContent(),
			request.headers);

		try {
			handler(service, message);
		} catch (r) {
			const trace = message.trace + '_' + this.tracer.next();

			if (r instanceof Rejection) {
				response.status(400).send({
					trace,
					code: r.code,
					reason: r.reason
				});
			} else {
				response.status(500).send({
					trace,
					message: 'sorry'
				});
			}
		}

	}
}

class Message {
	constructor(trace, name, content=null, meta={}) {
		this.trace = trace;
		this.name = name;
		this.content = content;
		this.meta = meta;
	}
}
