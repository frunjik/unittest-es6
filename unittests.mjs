function assert(expression, message) {
	if (!!expression) return;
	throw new Error(message || `assertion failed: ${expression}`);
}

function assertEqual(actual, expected, message) {
	if (actual === expected) return;
	const m = message || 'assertion failed';
	throw new Error(`${m} expected "${expected}", but got "${actual}"`);
}

class TestSuite {
	constructor(testClass) {
		this.tests = [];
		testClass && this.addTests(testClass);
	}
	
	addTest(test) {
		this.tests.push(test);
	}

	addTests(testClass) {
		Object.getOwnPropertyNames(testClass.prototype)
			.filter(m => m.startsWith('test'))
			.forEach(m => this.addTest(new testClass(m)))
	}

	run(r) {
		const result = r || new TestResult();
		this.tests.forEach(test => test.run(result));
		return result;
	}
}

class TestResult {
	constructor() {
		this.runCount = 0;
		this.failCount = 0;
	}

	testStarted() {
		this.runCount++;
	}
	
	testFailed(/*test, error*/) {
		this.failCount++;
		// console.log(`${test.name} - ${error}`);
	}

	summary() {
		return `${this.runCount} run, ${this.failCount} failed`;
	}
}

class TestCase {
	constructor(name) {
		this.name = name;
	}

	run(r) {
		this.setUp();
		const result = r || new TestResult();
		result.testStarted();
		try {
			this[this.name]();
		} catch (error) {
			result.testFailed(this, error);
		}
		this.tearDown();
		return result;
	}

	setUp() {
	}

	tearDown() {
	}
}

export { TestCase, TestResult, TestSuite, assert, assertEqual };
