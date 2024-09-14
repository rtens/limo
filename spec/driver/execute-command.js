import test from 'ava'
import Fixture from './_fixture.js'

test('use path of POST as name', t => {
  let name = null
  const fix = new Fixture()
  fix.service('foo', {
    execute: command => name = command.name
  })

  fix.post('*', "/foo/bar/")

  t.is(name, 'bar')
  t.like(fix.response, {
    status: 200,
    content: 'OK'
  })
})

test.todo('use body as content')

test.todo('use headers as meta')

test.todo('include slashes in name')

test('respond 404 if Service does not exist', t => {
  const fix = new Fixture()
  
  fix.post('*', '/foo/')
  
  t.like(fix.response, {
    status: 404,
    content: "Service 'foo' does not exist"
  })
})

test.todo('respond 400 if rejected')

test.todo('respond 500 if Exception is thrown')
