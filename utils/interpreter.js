/* 
  literal = itself
  grouping = its an expression already
  unary = [operator, expression]
  binary = [operator, left, right]
  ternary = ?: [operator, test, then, else_st]
            comparison form* is more like ["&&", binary, binary]
            *: z > x > y broken into z > x && x > y
*/

const interpreter = (AST) => {
  // can be recursive.
  // see if any of the elements within the top level are arrays.
  // if so call interpret on that array.
  if (!Array.isArray(AST)) {
    return AST
  }

  switch (AST.length) {
    case 0:
    case 1:
    default:
      return null
    case 2:
      return interpretUnary(AST)
    case 3:
      return interpretBinary(AST)
    case 4: 
      return interpretTernary(AST)
  }
}

const interpretBinary = (AST) => {
  let left = AST[1]; let right = AST[2];
  if (Array.isArray(left)) {
    left = interpreter(left)
  }
  if (Array.isArray(right)) {
    right = interpreter(right)
  }
  switch (AST[0].type) {
    case "BANG_EQUAL":
      return left !== right
    case "EQUAL_EQUAL":
      return left === right
    case "GREATER":
      return left > right
    case "GREATER_EQUAL":
      return left >= right
    case "LESS":
      return left < right
    case "LESS_EQUAL":
      return left <= right
    case "MINUS":
      // type issue
      return left - right
    case "PLUS":
      // type issue
      return left + right
    case "STAR":
      // type issue
      return left * right
    case "SLASH":
      // type issue
      // throws error if right is 0
      if (right === 0) return null
      return left / right
    default:
      break;
  }
}

const interpretUnary = (AST) => {
  let right = AST[1];
  if (Array.isArray(right)) {
    right = interpreter(right)
  }
  switch (AST[0].type) {
    case "MINUS":
      return -(right)
    case "BANG":
      return !(right)
    default:
      break;
  }
}

const interpretTernary = (AST) => {
  let test = AST[1]; let then = AST[2]; let else_st = AST[3];
  if (Array.isArray(test)) {
    test = interpreter(test);
  }
  if (Array.isArray(then)) {
    then = interpreter(then);
  }
  if (Array.isArray(else_st)) {
    else_st = interpreter(else_st);
  }

  switch (AST[0].type) {
    case "QUESTION_MARK":
      return test ? then : else_st;
    default:
      break;
  }
}

module.exports = interpreter