const tokenType = require("./tokenTypes.js")
const { error } = require("./errorHandler.js")

let tokens = [];

const keywords = {
  "and": "AND",
  "class": "CLASS",
  "else": "ELSE",
  "false": "FALSE",
  "for": "FOR",
  "fun": "FUN",
  "if": "IF",
  "nil": "NIL",
  "or": "OR",
  "print": "PRINT",
  "return": "RETURN",
  "super": "SUPER",
  "this": "THIS",
  "true": "TRUE",
  "var": "VAR",
  "while": "WHILE"
}

// generate a token object
const token = (type, lexeme, literal, line) => {
  return {
    type: tokenType[type], // honestly this is useless in JS lol
    lexeme, 
    literal, 
    line, 
    toString: () => `${type} ${lexeme} ${literal}`
  };
}

// scan all characters
const scanTokens = (input) => {
  let start = 0;
  let current = 0;
  let line = 1;

  let source = input;

  const isAtEnd = () => current >= source.length;

  // add a single token
  const addToken = (type, literal = null) => {
    text = source.substring(start, current);
    tokens.push(token(type, text, literal, line))
  }

  // go to next character & consume
  const advance = () => {
    return source[current++]
  }

  // checks next character and only consumes it if it matches
  const match = (expected) => {
    if (isAtEnd()) return false;
    if (source[current] !== expected) return false;

    current += 1;
    return true;
  }

  // only looks ahead without consuming a character
  const peek = () => {
    if (isAtEnd()) return '\0';
    return source[current];
  }

  const peekNext = () => {
    if (current + 1 >= source.length) return '\0';
    return source[current+1]
  }

  // consumes a string
  const string = () => {
    while (peek() !== '"' && !isAtEnd()) {
      if (peek() == '\n') line++; // allows multi-line strings....
      advance();
    }
    
    if (isAtEnd()) {
      error(line, current, "Unterminated string.");
      return;
    }

    // closing "
    advance();

    // trim the quotes out
    const value = source.substring(start + 1, current - 1);
    addToken("STRING", value)
  }

  const isDigit = c => c >= "0" && c <= "9";

  // consumes a number
  const number = () => {
    while(isDigit(peek())) advance();

    // look for decimal
    if (peek() === '.' && isDigit(peekNext())) {
      //consume .
      advance();

      while(isDigit(peek())) advance();
    }

    addToken("NUMBER", parseFloat(source.substring(start, current)));
  }

  const isAlpha = c => c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '_';

  const isAlphaNumeric = c => isAlpha(c) || isDigit(c);

  // consumes identifier
  const identifier = () => {
    while(isAlphaNumeric(peek())) advance();

    text = source.substring(start, current);
    type = keywords[text];
    if (!type) type = "IDENTIFIER";
    addToken(type);
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
      case '!': 
        addToken(match('=') ? "BANG_EQUAL" : "BANG");
        break;
      case '=': 
        addToken(match('=') ? "EQUAL_EQUAL" : "EQUAL");
        break;
      case '<': 
        addToken(match('=') ? "LESS_EQUAL" : "LESS");
        break;
      case '>': 
        addToken(match('=') ? "GREATER_EQUAL" : "GREATER");
        break;
      case '/':
        if (match('/')) {
          while (peek() !== '\n' && !isAtEnd()) advance();
        } else if (match('*')) {
          while (peek() !== '*' && peekNext() !== "/" && !isAtEnd()) {
            if (peek() === '\n') line++;
            advance();
          }
          current += 2;
        } else {
          addToken("SLASH");
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // whitespace
        break;
      case '\n':
        line++;
        break;
      case '"': string(); break;
      default: 
        if (isDigit(c)) {
          number();
        } else if (isAlpha(c)) {
          identifier();
        } else {
          error(line, current, "Unexpected character " + c + ".");
        } 
        break;
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
