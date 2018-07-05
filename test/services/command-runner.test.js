require("../extensions");

const CommandRunner = require("../../src/services/command-runner");
const Trump = require("../../src/plugins/trump/index");
jest.mock("../../src/plugins/trump/index");

let commandRunner;
const mockedTrumpPlugin = new Trump();

beforeEach(() => {
  commandRunner = new CommandRunner();
  jest.clearAllMocks();
});

describe("addCommands", () => {
  test("should add a command", () => {
    const inputs = { commandArray: ["!test"], pluginName: "Test" };
    commandRunner.addCommands(inputs.commandArray, inputs.pluginName);
    expect(commandRunner.commands).mapContainingObject({ "!test": "Test" });
  });
});

describe("addPlugins", () => {
  test("should fail because plugin is not available", () => {
    const inputPluginName = "Test";
    expect(() => commandRunner.addPlugins(inputPluginName)).toThrow();
  });
});
