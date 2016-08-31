// require all modules
var _ = require('lodash')
var expr = require('expr-tree')


// exports
module.exports = {
  // tokenize input
  tokenize: function(input) {
    // trimming args
    input = input.trim()
    tokens = []

    // split the input
    input = input.replace(/([\(\)])/g, ' $1 ') // space parenthesis
    input = input.replace(/([+*\-\^\\\/])/g, ' $1 ') // space operators
    input = input.replace(/,/g, ' , ') // space commas
    input = input.replace(/\s+/g, ' ') // even spaces
    input = input.split(/\s/g) // split around spaces

    // storing operator data
    var leftAssociativity = [true, true, true, true, false]
    var precedence = [1, 1, 2, 2, 3]
    // going through tokens
    for (var i = 0; i < input.length; i++) {
      // getting label
      var label = input[i]
      // treating
      if (label === '') {
        // pass
        continue
      } else if ('+-*/^'.indexOf(label) !== -1 && label.length == 1) {
        // get the id
        var id = '+-*/^'.indexOf(label)
        // the token is an operator
        tokens.push({
          type: 'operator',
          leftAssociative: leftAssociativity[id],
          precedence: precedence[id],
          value: label
        })
      } else if ('()'.indexOf(label) !== -1) {
        // the token is a parenthesis
        tokens.push({
          type: 'parenthesis',
          value: label
        })
      } else if (',' === label) {
        // the token is a comma
        tokens.push({
          type: 'separator',
          value: label
        })
      } else if (!isNaN(Number(label))) {
        // the token is a number
        tokens.push({
          type: 'number',
          value: Number(label)
        })
      } else if (expr.operators[label]) {
        // the token is a function
        tokens.push({
          type: 'function',
          value: label
        })
      } else if ('xyt'.indexOf(label) !== -1 && label.length == 1) {
        // the token is a variable
        tokens.push({
          type: 'variable',
          value: label
        })
      } else {
        // invalid token !
        return undefined
      }
    }
    // returns tokens
    return tokens
  }


},

  // returns RPN from infix
  shuntingYard: function (tokens) {
    // if tokens are empty
    if (!tokens || tokens.length == 0) {
      return
    }
    // create temp
    var output = [], stack = []
    // while there are tokens to be read
    while (tokens.length > 0) {
      // get the token
      var token = tokens.shift()
      // act depending on type
      if (token.type == 'number' || token.type == 'variable') {
        // add to the output queue
        output.push(token.value)
      } else if (token.type == 'function') {
        // add to the stack
        stack.push(token)
      } else if (token.type == 'separator') {
        // until the token at the top is a left parenthesis
        while (stack.length > 0 && stack[stack.length - 1].value != '(') {
          // pop operators off the stack to the output
          output.push(stack.pop().value)
        }
        // if stack is empty, something was wrong
        if (stack.length == 0) {
          return undefined
        }
      } else if (token.type == 'operator') {
        // test for operator precedence
        while (stack.length > 0 && stack[stack.length - 1].type == 'operator'
               && ((token.leftAssociative && token.precedence <= stack[stack.length - 1].precedence)
                  || (!token.leftAssociative && token.precedence < stack[stack.length - 1].precedence)) ) {
          // pop operators off the stack to the output
          output.push(stack.pop().value)
        }
        // push operator
        stack.push(token)
      } else if (token.type == 'parenthesis') {
        if (token.value == '(') {
          // push to stack
          stack.push(token)
        } else if (token.value == ')') {
          // until the token at the top is a left parenthesis
          while (stack.length > 0 && stack[stack.length - 1].value != '(') {
            // pop operators off the stack to the output
            output.push(stack.pop().value)
          }
          // if stack is empty, something was wrong
          if (stack.length == 0) {
            return undefined
          }
          // remove the parenthesis
          stack.pop()
          // if function
          if (stack.length > 0 && stack[stack.length - 1].type == 'function') {
            // push in output
            output.push(stack.pop().value)
          }
        }
      }
    }

    // if still operator tokens
    while (stack.length > 0) {
      if (stack[stack.length - 1].type === 'parenthesis'){
        return undefined
      }
      // push in output
      output.push(stack.pop().value)
    }

      // return rpn
      var rpn = output.join(' ')
      return expr.isExpressionTree(rpn) ? rpn : undefined
  }
}
