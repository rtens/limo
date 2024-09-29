import test from 'ava';
import Fixture from './_fixture.js';
import Rejection from '../../src/rejection.js';

test('use path as name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.get('*', "/foo/bar/");

	t.like(fix.service('foo').answered, {
		name: 'bar'
	});
});

test('Generate trace identifier', t => {
	const fix = new Fixture();
	fix.nextTraces('one');
	fix.mockService('foo');

	fix.get('*', "/foo/bar/");

	t.like(fix.service('foo').answered, {
		trace: 'one'
	});
});

test('Respond with answer', t => {
	const fix = new Fixture();
	fix.mockService('foo').answers(_ => 'bam');

	fix.get('*', "/foo/bar/");

	t.like(fix.response, {
		status: 200,
		content: 'bam'
	});
});

test('use quey parameters as content', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.get('*', "/foo/bar/", {some: 'value'});

	t.like(fix.service('foo').answered, {
		name: 'bar',
		content: {some: 'value'}
	});
});

test('use headers as meta', t => {
	const fix = new Fixture;
	fix.mockService('foo');

	fix.get('*', '/foo/bar', null, {aKey: 'a value'});

	t.like(fix.service('foo').answered, {
		name: 'bar',
		meta: {aKey: 'a value'}
	});
});

test('include slashes in name', t => {
	const fix = new Fixture();
	fix.mockService('foo');

	fix.get('*', "/foo/bar/bam/");

	t.like(fix.service('foo').answered, {
		name: 'bar/bam'
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
	fix.nextTraces('one', 'two');
	fix.mockService('foo').answers(_ => {
		throw new Rejection('NOPE', 'no way');
	});

	fix.get('*', '/foo/bar');

	t.like(fix.response, {
		status: 400,
		content: {
			trace: 'one_two',
			code: 'NOPE',
			reason: 'no way'
		}
	});
});

test('respond 500 if Exception is thrown', t => {
	const fix = new Fixture();
	fix.nextTraces('one', 'two');
	fix.mockService('foo').answers(_ => {
		throw new Exception('sorry');
	});

	fix.get('*', '/foo/bar');

	t.like(fix.response, {
		status: 500,
		content: {
			trace: 'one_two',
			message: 'sorry'
		}
	});
});
