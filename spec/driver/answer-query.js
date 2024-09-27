import test from 'ava';
import Fixture from './_fixture.js';
import Rejection from '../../src/rejection.js';

test('use path as name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.get('*', "/foo/bar/");

	t.like(fix.service('foo').answered, {
		name: 'bar',
		content: null
	});
});

test.todo('Respond with answer');

test.todo('use quey parameters as content');

test.todo('use headers as meta');

test('include slashes in name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.get('*', "/foo/bar/bam/");

	t.like(fix.service('foo').answered, {
		name: 'bar/bam',
		content: null
	});
});

test('respond 404 if Service does not exist', t => {
	const fix = new Fixture();

	fix.get('*', '/foo/');

	t.like(fix.response, {
		status: 404,
		content: "Service 'foo' does not exist"
	});
});

test('respond 400 if rejected', t => {
	const fix = new Fixture();
	fix.mockService('foo').answers(_ => {
		throw new Rejection('NOPE', 'no way');
	});

	fix.get('*', '/foo/bar');

	t.like(fix.response, {
		status: 400,
		content: {
			code: 'NOPE',
			reason: 'no way'
		}
	});
});

test('respond 500 if Exception is thrown', t => {
	const fix = new Fixture();
	fix.mockService('foo').answers(_ => {
		throw new Exception('sorry');
	});

	fix.get('*', '/foo/bar');

	t.like(fix.response, {
		status: 500,
		content: {
			message: 'sorry'
		}
	});
});
