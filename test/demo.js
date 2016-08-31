var VJSession = require('../lib/vj-session.js')
var expr = require('expr-tree')
var fs = require('fs')
var Canvas = require('canvas')

var rpn = "1 3.12 tan sqrt x atan2 sqrt y 9.73 sin atan2 7.24 x - max 3.92 y 7.94 min cos x ^ + tan % * *"
var session = new VJSession(rpn)

// use node-canvas
var canvas = new Canvas(320,240)
var ctx = canvas.getContext('2d')
// start drawing
ctx.fillStyle = '#000'
ctx.clearRect(0,0,320,240)
session.draw(ctx)

fs.writeFileSync("./test/test.png", canvas.toBuffer())
