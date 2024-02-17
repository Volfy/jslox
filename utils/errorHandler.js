// error handling
let hadError = false;

const error = (line, message) => report(line, "", message);
const pError = (token, message) => token.type === "EOF" ? report(token.line, "at end", message) : report(token.line, `at '${token.lexeme}'`, message)
const report = (line, where, message) => {
  console.error(`[line ${line}] Error ${where}: ${message}`); 
  hadError = true
}

const setHadError = (flag) => hadError = flag;
const getHadError = () => hadError;


module.exports = { error, pError, setHadError, getHadError };