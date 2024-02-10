const tokenType = require("./tokenTypes.js")
const { error } = require("./errorHandler.js")

let tokens = [];

// generate a token object
const token = (type, lexeme, literal, line) => {
  return {
    type: tokenType[type], 
    lexeme, 
    literal, 
    line, 
    toString: () => `${this.type} ${this.lexeme} ${this.literal}`
  };
}

// scan all characters
const scanTokens = (input) => {
  let start = 0;
  let current = 0;
  let line = 1;

  let source = input;

  const isAtEnd = () => current >= source.length;

  // go to next character
  const advance = () => {
    return source[current++]
  }

  // add a single token
  const addToken = (type, literal = null) => {
    text = source.substring(start, current);
    tokens.push(token(type, text, literal, line))
  }

  // scan a single character
  const scanToken = () => {
    const c = advance(source)
    switch(c) {
      case '(': addToken("LEFT_PAREN"); break;
      case ')': addToken("RIGHT_PAREN"); break;
      case '{': addToken("LEFT_BRACE"); break;
      case '}': addToken("RIGHT_BRACE"); break;
      case ',': addToken("COMMA"); break;
      case '.': addToken("DOT"); break;
      case '-': addToken("MINUS"); break;
      case '+': addToken("PLUS"); break;
      case ';': addToken("SEMICOLON"); break;
      case '*': addToken("STAR"); break; 
      default: error(line, current, "Unexpected character " + c + "."); break;
    }
  }
  
  while(!isAtEnd()) {
    start = current;
    scanToken(source);
  }

  tokens.push(token("EOF", "", null, line));
  return tokens
};


module.exports = { scanTokens }
