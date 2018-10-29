// put your javascript (node.js) code here
const fs = require('fs');
const input = fs.readFileSync(0).toString().split('\n').map((e)=>e.split(' '));
let n = input[0][0];
let k = input[0][1];
let s = input[input.length-1][0];
let t = input[input.length-1][1];
input.splice(0,1);
input.splice(input.length-1,1);
let coords  = input;
console.log(n,k,s,t);
console.log(canDoIt(n,k,s,t, coords));
function canDoIt(){
    
}
function heuristic(dx,dy) {
  return Math.sqrt(dx * dx + dy * dy);
}
function getTimeToGo(x,y){//x->j (xi−xj)^2+(yi−yj)^2
    return (x[0], y[0])(x[1], y[1]);
}
var graph = [
  {
    weight: 1,
    poly: [
      { x: 1, y: 1 }
    ]
  }, {
    weight: 1,
    poly: [
      { x: 5, y: 5 }
    ]
  }
];
var firstPoint = {
  x: 0,
  y: 0
};