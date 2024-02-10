const fs = require('node:fs');
const prompt = require('prompt-sync')();
const scanner = require('./utils/scanner');
const { setHadError, getHadError } = require('./utils/errorHandler.js')

process.on("exit", code => code === 0 ? console.log("exiting with no issues") : console.error(`exiting with code ${code}`))

// variables & constants
let args = process.argv.filter((_arg, idx) => idx > 1)

// functions

// handles cli 
const main = () => {
  if (args.length > 1) {
    return console.log("Usage: node index.js [script]")
  }
  if (args.length === 1) {
    return runFile(args[0])
  }

  return runPrompt()
}

// for a file input
const runFile = (filename) => {
  fs.readFile(`./${filename}`, 'utf-8', (err, data) => {
    if (err) return console.error(err);
    run(data);
    if (getHadError()) process.exit(1);
  })
};

// REPL essentially
const runPrompt = () => {
  console.log("Welcome to jslox interpreter");
  console.log("Ctrl+C to exit");
  while (true) {
    const line = prompt("> ");
    if (line === null) break;
    run(line);
    if (getHadError()) setHadError(false);
  }
  console.log("Bye!")
};

// scanning process
const run = (ln) => {
  const tokens = scanner.scanTokens(ln);
  tokens.map(token => console.log(token))
};

// init
main();