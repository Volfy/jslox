// error handling
let hadError = false;

const error = (line, message) => report(line, "", message);
const report = (line, where, message) => {
  console.error(`[line ${line}] Error ${where}: ${message}`); 
  hadError = true
}

const setHadError = (flag) => hadError = flag;
const getHadError = () => hadError;


module.exports = { error, setHadError, getHadError };