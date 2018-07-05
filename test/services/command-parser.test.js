const CommandRunner = require('../../src/services/command-runner');
const CommandParser = require('../../src/services/command-parser');
jest.mock('../../src/services/command-runner');

const mockedRunner = new CommandRunner();
let commandParser;

beforeEach(() => {
  commandParser = new CommandParser(mockedRunner);
  jest.clearAllMocks();
});

describe('validate', () => {
  test('should confirm valid command', () => {
    const validCommand = { content: '!r' };
    expect(commandParser.validate(validCommand)).toBe(true);
  });

  test('should reject invalid command', () => {
    const invalidCommand = { content: 'r' };
    expect(commandParser.validate(invalidCommand)).toBe(false);
  });
});

describe('tokenize', () => {
  test('should return command', () => {
    const inputCommand = { content: '!a username' };
    const expectedCommand = { instruction: 'a', params: ['username'] };
    expect(commandParser.tokenize(inputCommand)).toEqual(expectedCommand);
  });
});

describe('handle', () => {
  test('should call validate and tokenize', () => {
    jest.spyOn(commandParser, 'validate');
    jest.spyOn(commandParser, 'tokenize');

    const inputCommand = { content: '!a username' };
    commandParser.handle(inputCommand);

    expect(commandParser.validate).toHaveBeenCalledTimes(1);
    expect(commandParser.tokenize).toHaveBeenCalledTimes(1);
  });

  test('should return command', () => {
    const inputCommand = { content: '!a username' };
    const expectedCommand = { instruction: 'a', params: ['username'] };
    expect(commandParser.handle(inputCommand)).toEqual(expectedCommand);
  });

  test('should reject invalid command', () => {
    jest.spyOn(commandParser, 'tokenize');

    const inputCommand = { content: 'a username' };
    expect(commandParser.handle(inputCommand)).toBe(false);

    expect(commandParser.tokenize).toHaveBeenCalledTimes(0);
  });
});
