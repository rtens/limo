import test from 'ava';
import Fixture from './_fixture.js';
import Rejection from '../../src/rejection.js';

test('use path of POST as name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.post('*', "/foo/bar/");

	t.like(fix.service('foo').executed, {
		name: 'bar',
		content: null
	});
});

test('Respond with OK', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.post('*', "/foo/bar/");

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

test('use headers as meta', t => {
	const fix = new Fixture;
	fix.mockService('foo');

	fix.post('*', '/foo/bar', null, {aKey: 'a value'});

	t.like(fix.service('foo').executed, {
		name: 'bar',
		meta: {aKey: 'a value'}
	});
});

test('include slashes in name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.post('*', "/foo/bar/bam/");

	t.like(fix.service('foo').executed, {
		name: 'bar/bam',
	});
});

test('respond 404 if Service does not exist', t => {
	const fix = new Fixture();

	fix.post('*', '/foo/');

	t.like(fix.response, {
		status: 404,
		content: "Service 'foo' does not exist"
	});
});

test('respond 400 if rejected', t => {
	const fix = new Fixture();
	fix.mockService('foo').executes(_ => {
		throw new Rejection('NOPE', 'no way');
	});

	fix.post('*', '/foo/bar');

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
	fix.mockService('foo').executes(_ => {
		throw new Exception('sorry');
	});

	fix.post('*', '/foo/bar');

	t.like(fix.response, {
		status: 500,
		content: {
			message: 'sorry'
		}
	});
});
