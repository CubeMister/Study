test('adds 1 + 2 to equal 3', ()=> {
  const sum = require('../sum');
  expect(sum(1, 2)).toBe(3);
});

// console.log(window);

/*

"jest": {
 "testEnvironment": "node"
}

*/

console.log(global);
