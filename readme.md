# Limo

Web-framework based Services with a unified interface consisting of

- execute Command - can change the state of a Service,
- answer Query - inquire about the current state of a Service
- publish Event - informs that something happened

## Capabilities

- Web Provider
	- execute Command
	- answer Query
- File Based Service Loader
	- load Service
- Standard Service
	- subscribe Event
	- unsubscribe Event
	- publish Event
- File Based Service
	- execute Command
	- answer Query
	- subscribe Event
	- react to Event
- Specification Executer
	- find Examples
	- execute Examples
- Interface Description Generator
	- generate Description
- Command Line Manager
	- list Servives (with descriptions)
	- list Messages of Service (with descriptions)
	- describe Message
	- search Message by name
	- search Message by content key


## Service Model

Service
- execute(Command)
- answer(Query): Any
- subscribe(Subscription, Subscriber)
- unsubscribe(Subscription)
- publish(Event)

Command: Message

Query: Message

Event: Message

Message
- interaction: String
- name: String
- meta: Map
- content: Map

Subscription:
- key: String
- meta: Map
- parameters: Map

Subscriber: (Event)

ServiceLoader
- load(service: String): Service

Provider
- execute(service: String, Command)
- answer(service: String, Command): Any

Rejection:
- interaction: String
- code: Symbol
- reason: String|Null

Failure:
- interaction: String
- message: String


## Specification Model

Specification
- service: Class
- [Capability]
- execute(): [Result]

Result
- path: [String]
- Capability
- Example
- status: PASSED|FAILED|SKIPPED|IGNORED
- [Fail]

Fail
- Expectation
- actual: Any

Capability
- name: String
- description: String|Null
- status: Null|SKIP|ONLY
- [Example]

Example
- name: String
- status: Null|SKIP|ONLY
- [Fact]
- Action
- [Expectation]

Fact
- realize(Execution)

Action
- perform(Execution)

Expectation
- expected: Any
- confirm(Execution): Fail|Null

Execution
- Service
- dependencies: {String: Dependency}
- failed: Failure|Null
- answer: Any
- published: [Event]


GivenCommandExecuted: Fact
- Command

GivenEventPublished: Fact
- Event

GivenAnswersQuery: Fact
- dependency: String
- Query
- answer: Any

WhenExecuteCommand: Action
- Command

WhenAnswerQuery: Action
- Query

WhenPublishEvent: Action
- dependency: String
- Event

ShouldReject: Expectation
- expected: Rejection

ShouldAnswer: Expectation

ShouldPublishEvents: Expectation
- expected: [Event]

ShouldExecuteCommands: Expectation
- dependency: String
- expected: [Command]


CapabilityBuilder
- name: String
- description: String|Null
- example(name:String, build:(ExampleBuilder)): This

ExampleBuilder
- given: {
		it: {
			executed: (Command)
		},
		(dependency:String): {
			published: (Event),
			answers: (Query): {
				with: (answer:Any)
			}
		}
	}
- when: {
		it: {
			executes: (Command),
	answer: (Query)
		},
		(dependency:String): {
			publishes: (Event)
		}
	}
- then: {
		it: { should: {
			reject: (Rejection),
			answer: (answer:Any),
			publish: ([Event])
		}},
		(dependency:String): { should: {
			execute: ([Command])
		}}
	}
