// error handling
let hadError = false;

const error = (line, offset, message) => report(line, offset, "", message);
const report = (line, offset, where, message) => {
  console.error(`[line ${line}:${offset} ] Error ${where}: ${message}`); 
  hadError = true
}

const setHadError = (flag) => hadError = flag;
const getHadError = () => hadError;


module.exports = { error, setHadError, getHadError };