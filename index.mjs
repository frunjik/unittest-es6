// node --experimental-modules index.mjs
import { runTests } from './testtests.mjs';

function log(text)  {
	console.log(text);
}

runTests(log);
