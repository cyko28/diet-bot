function extend() {
  expect.extend({
    toContainObject(received, argument) {
      const pass = this.equals(
        received,
        expect.arrayContaining([expect.objectContaining(argument)])
      );

      if (pass) {
        return {
          message: () =>
            `expected ${this.utils.printReceived(
              received
            )} not to contain object ${this.utils.printExpected(argument)}`,
          pass: true
        };
      } else {
        return {
          message: () =>
            `expected ${this.utils.printReceived(
              received
            )} to contain object ${this.utils.printExpected(argument)}`,
          pass: false
        };
      }
    },
    mapContainingObject(received, argument) {
      const argumentKeys = Object.keys(argument);
      if (argumentKeys.length != 1) {
        return {
          message: () =>
            `expected ${this.utils.printExpected(
              argument
            )} to be an object with a single key`,
          pass: false
        };
      }

      if (!(received instanceof Map)) {
        return {
          message: () =>
            `expected ${this.utils.printReceived(received)} to be an ES6 Map`,
          pass: false
        };
      }

      if (
        received.has(argumentKeys[0]) &&
        received.get(argumentKeys[0]) === argument[argumentKeys[0]]
      ) {
        return {
          message: () =>
            `expected ${this.utils.printReceived(
              received
            )} not to contain object ${this.utils.printExpected(argument)}`,
          pass: true
        };
      } else {
        return {
          message: () =>
            `expected ${this.utils.printReceived(
              received
            )} to contain object ${this.utils.printExpected(argument)}`,
          pass: false
        };
      }
    }
  });
}

module.exports = extend();
