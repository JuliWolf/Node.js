"use strict";
var num1Element = document.getElementById('num1');
var num2Element = document.getElementById('num2');
var buttonElement = document.querySelector('button');
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + " " + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
if (buttonElement) {
    buttonElement.addEventListener('click', function () {
        var num1 = num1Element.value;
        var num2 = num2Element.value;
        var result = add(+num1, +num2);
        console.log(result);
        printResult({ val: result, timestamp: new Date() });
    });
}
// console.log(add(1, 6));
// console.log(add("1", "6"));
