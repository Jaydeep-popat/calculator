// Simple test script to verify calculator functions
console.log('Testing calculator mathematical functions...\n');

// Test basic arithmetic
console.log('Basic Arithmetic Tests:');
console.log('2 + 3 =', 2 + 3);
console.log('10 - 4 =', 10 - 4);
console.log('6 * 7 =', 6 * 7);
console.log('15 / 3 =', 15 / 3);
console.log('2 ^ 3 =', Math.pow(2, 3));

// Test trigonometric functions
console.log('\nTrigonometric Functions (degrees):');
const toRad = (x) => (x * Math.PI) / 180;
console.log('sin(30°) =', Math.sin(toRad(30)));
console.log('cos(60°) =', Math.cos(toRad(60)));
console.log('tan(45°) =', Math.tan(toRad(45)));

console.log('\nTrigonometric Functions (radians):');
console.log('sin(π/6) =', Math.sin(Math.PI/6));
console.log('cos(π/3) =', Math.cos(Math.PI/3));
console.log('tan(π/4) =', Math.tan(Math.PI/4));

// Test logarithmic functions
console.log('\nLogarithmic Functions:');
console.log('ln(e) =', Math.log(Math.E));
console.log('log(100) =', Math.log10(100));
console.log('sqrt(16) =', Math.sqrt(16));

// Test factorial function
console.log('\nFactorial Function:');
const factorial = (n) => {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial');
  if (n > 170) throw new Error('Factorial too large');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

console.log('5! =', factorial(5));
console.log('0! =', factorial(0));
console.log('10! =', factorial(10));

// Test edge cases
console.log('\nEdge Cases:');
try {
  console.log('Division by zero:', 1/0);
  console.log('ln(-1):', Math.log(-1));
  console.log('sqrt(-1):', Math.sqrt(-1));
  console.log('171! =', factorial(171));
} catch (e) {
  console.log('Error caught:', e.message);
}

console.log('\nAll tests completed!');