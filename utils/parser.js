const TokenTypes = require("./tokenTypes.js")
const { pError } = require("./errorHandler.js")
const Ast = require('./ast.js')

const parser = (tokenList) => {
  let current = 0

  const expression = () => {
    return equality();
  }
  
  const equality = () => {
    let expr = comparison();
    while(match(["BANG_EQUAL", "EQUAL_EQUAL"])) {
      const operator = previous().type;
      const right = comparison();
      expr = Ast.Binary(expr, operator, right)
    }

    return expr;
  }

  const comparison = () => {
    let expr = term();

    while (match(["GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL"])) {
      const operator = previous().type;
      const right = term();
      expr = Ast.Binary(expr, operator, right);
    }

    return expr;
  }

  const term = () => {
    let expr = factor();

    while (match(["MINUS", "PLUS"])) {
      const operator = previous().type;
      const right = factor();
      expr = Ast.Binary(expr, operator, right)
    }

    return expr;
  }

  const factor = () => {
    let expr = unary();

    while (match(["SLASH", "STAR"])) {
      const operator = previous().type;
      const right = unary();
      expr = Ast.Binary(expr, operator, right);
    }

    return expr;
  }

  const unary = () => {
    if (match(["BANG", "MINUS"])) {
      const operator = previous().type;
      const right = unary();
      return Ast.Unary(operator, right);
    }
    return primary();
  }

  const primary = () => {
    if (match(["FALSE"])) return Ast.Literal(false);
    if (match(["TRUE"])) return Ast.Literal(true);
    if (match(["NIL"])) return Ast.Literal(null);

    if (match(["NUMBER", "STRING"])) {
      return Ast.Literal(previous().literal);
    }

    if (match(["LEFT_PAREN"])) {
      const expr = expression();
      consume("RIGHT_PAREN", "Expect ')' after expression.");
      return Ast.Grouping(expr)
    }
  }

  const match = (types) => {
    return types.some(type => {
      if (check(type)) {
        advance();
        return true;
      }
    })
  }

  const consume = (type, message) => {
    if (check(type)) return advance();

    error(peek(), message);
  }

  const error = (token, message) => {
    pError(token, message)
    throw new SyntaxError()
  }
  
  const check = (type) => {
    if (isAtEnd()) return false;
    return peek().type === type;
  }
  
  const advance = () => {
    if (!isAtEnd()) current++;
    return previous();
  }
  
  const isAtEnd = () => {
    return peek().type === "EOF"
  }
  
  const peek = () => {
    return tokenList[current]
  }

  const previous = () => {
    return tokenList[current - 1]
  }

  console.log(JSON.stringify(expression()))
}

