import test from 'ava';
import Fixture from './_fixture.js';

test('use path of POST as name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.post('*', "/foo/bar/");

	t.like(fix.service('foo').executed, {
		name: 'bar',
		content: null
	});
	t.like(fix.response, {
		status: 200,
		content: 'OK'
	});
});

test('use body as content', t => {
	const fix = new Fixture;
	fix.mockService('foo');

	fix.post('*', '/foo/bar', {some: 'content'});

	t.like(fix.service('foo').executed, {
		name: 'bar',
		content: {some: 'content'}
	});
});

test.todo('use headers as meta');

test.todo('include slashes in name');

test('respond 404 if Service does not exist', t => {
	const fix = new Fixture();

	fix.post('*', '/foo/');

	t.like(fix.response, {
		status: 404,
		content: "Service 'foo' does not exist"
	});
});

test.todo('respond 400 if rejected');

test.todo('respond 500 if Exception is thrown');
