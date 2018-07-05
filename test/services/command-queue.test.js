const CommandRunner = require("../../src/services/command-runner");
const CommandQueue = require("../../src/services/command-queue");
jest.mock("../../src/services/command-runner");

const mockedRunner = new CommandRunner();
let commandQueue;

beforeEach(() => {
  commandQueue = new CommandQueue(mockedRunner, undefined);
  jest.clearAllMocks();
});

describe("add", () => {
  test("should add command to queue", () => {
    jest.spyOn(commandQueue, "fetch");
    jest.spyOn(mockedRunner, "run");

    const command = {
      message: "A test command message",
      instruction: "!a",
      params: "test"
    };

    commandQueue.add(command.message, command.instruction, command.params);
    expect(commandQueue.fetch).toHaveBeenCalledTimes(1);
    expect(mockedRunner.run).toHaveBeenCalledTimes(1);
  });
});

describe("fetch", () => {
  test("should do nothing because queue is empty", () => {
    jest.spyOn(commandQueue, "checkBack");
    jest.spyOn(mockedRunner, "run");

    expect(commandQueue.buffer.length).toBe(0);
    commandQueue.fetch();

    expect(commandQueue.checkBack).toHaveBeenCalledTimes(0);
    expect(mockedRunner.run).toHaveBeenCalledTimes(0);
  });
});
