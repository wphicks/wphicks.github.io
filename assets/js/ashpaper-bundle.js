(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(exports) {
    "use strict";
    exports.count_syllables = function(string) {
        var diphthongs = [
            "ai", "au", "ay", "ea", "ee", "ei", "ey", "oa", "oe", "oi", "oo",
            "ou", "oy", "ua", "ue", "ui"
        ];
        var syllables = 0;
        string = string.toLowerCase();
        var words = string.split(/\s+/).filter(
            function(cluster) {return cluster.length !== 0;}
        );
        for (var i=0; i < words.length; i++) {
            var word = words[i].replace(/e$/, "");
            word = word.replace(/[^a-zA-Z]/, "");
            var vowel_clusters = word.split(/[^aeiouy]+/).filter(
                function(cluster) {return cluster.length !== 0;}
            );
            var word_syllables = 0;
            for (var j=0; j < vowel_clusters.length; j++){
                if (diphthongs.indexOf(vowel_clusters[j]) >= 0){
                    word_syllables += 1;
                } else {
                    word_syllables += Math.min(2, vowel_clusters[j].length);
                }
            }
            syllables += Math.max(word_syllables, 1);
        }
        return syllables;
    };

    exports.choose_register = function(string) {
        if (/^\s/.test(string)){
            return 1;
        }
        return 0;
    };

    exports.Stack = function() {
        if ( !(this instanceof exports.Stack) ) {
            return new exports.Stack();
        }
        this._values = [];
    };
    exports.Stack.prototype = {
        pop:
            function(){
                if (this._values.length === 0) {
                    return null;
                }
                return this._values.pop();
            },
        push:
            function(new_value){
                this._values.push(new_value);
            },
    };

    exports.Instruction = function(command, syllables, register_index) {
        if ( !(this instanceof exports.Instruction) ) {
            return new exports.Instruction(command, syllables, register_index);
        }
        this.command = command;
        this.syllables = syllables;
        this.register_index = register_index;
    };

    exports.Program = function(raw_instructions) {
        if ( !(this instanceof exports.Program) ) {
            return new exports.Program(raw_instructions);
        }
        this.registers = [0, 0];
        this.stack = new exports.Stack();
        this.instructions = [];
        this.execution_index = 0;
        this.output = "";
        for (var i=0; i < raw_instructions.length; i++){
            this.instructions.push(raw_instructions[i]);
        }
    };
    exports.Program.prototype = {
        execute:
            function(){
                this.execute_to(this.instructions.length);
            },
        execute_to:
            function(line_number){
                this.registers = [0, 0];
                this.stack = new exports.Stack();
                this.execution_index = 0;
                this.output = "";
                while(this.execution_index < line_number &&
                        this.execution_index < this.instructions.length){
                    this.execute_line(this.execution_index);
                    this.execution_index++;
                }
            },
        execute_line:
            function(line_number){
                var instruction = this.instructions[line_number];
                var register_index = instruction.register_index;
                var syllables = instruction.syllables;
                switch(instruction.command){
                    case "GOTOIF":
                        if(
                                this.registers[register_index] >
                                instruction.syllables){
                            this.execution_index = (
                                this.registers[(register_index + 1) % 2] %
                                this.instructions.length
                            );
                            this.execute_line(this.execution_index);
                        }
                        break;
                    case "STORE":
                        this.registers[register_index] = syllables;
                        break;
                    case "NEG":
                        this.registers[register_index] = -1*this.registers[
                            register_index];
                        break;
                    case "MUL":
                        this.registers[register_index] = (
                            this.registers[0]*this.registers[1]);
                        break;
                    case "ADD":
                        this.registers[register_index] = (
                            this.registers[0]+this.registers[1]);
                        break;
                    case "PRINT":
                        this.output += String.fromCharCode(
                                this.registers[register_index]);
                        break;
                    case "PRINTR":
                        this.output += this.registers[register_index];
                        break;
                    case "POP":
                        var new_value = this.stack.pop();
                        if (new_value !== null) {
                            this.registers[register_index] = new_value;
                        }
                        break;
                    case "PUSH":
                        this.stack.push(this.registers[register_index]);
                        break;
                    case "GOTO":
                        this.execution_index = (
                            this.registers[register_index] %
                            this.instructions.length
                        );
                        this.execute_line(this.execution_index);
                        break;
                    default:
                        break;
                }
            }
    };

    exports.Interpreter = function() {
        if ( !(this instanceof exports.Interpreter) ) {
            return new exports.Interpreter();
        }
    };
    exports.Interpreter.prototype = {
        interpret:
            function(string) {
                var instructions = [];
                var lines = string.split(/\r?\n/);
                for (var i=0; i < lines.length; i++){
                    instructions.push(this.interpret_line(lines[i]));
                }
                return exports.Program(instructions);
            },
        interpret_line:
            function(line) {
                var syllables = exports.count_syllables(line);
                var register = exports.choose_register(line);
                if (line.search("/") >= 0) {
                    return exports.Instruction("GOTOIF", syllables, register); 
                }
                if (/\b\S+[A-Z]\S+\b/.test(line)) {
                    return exports.Instruction("NEG", syllables, register);
                }
                if (/\b[A-Z][^A-Z]+\b/.test(line)) {
                    return exports.Instruction("MUL", syllables, register);
                }
                if (/\b(like|as)\b/.test(line)) {
                    return exports.Instruction("ADD", syllables, register);
                }
                if (line.search("\\?") >= 0) {
                    return exports.Instruction("PRINT", syllables, register); 
                }
                if (line.search("\\.") >= 0) {
                    return exports.Instruction("PRINTR", syllables, register); 
                }
                if (line.search(",") >= 0) {
                    return exports.Instruction("POP", syllables, register); 
                }
                if (line.search("-") >= 0) {
                    return exports.Instruction("PUSH", syllables, register); 
                }
                var allit_line = line.toLowerCase();
                var word_reg = /\b\w+\b/g;
                var cur_word = word_reg.exec(allit_line);
                var next_word = word_reg.exec(allit_line);
                if (cur_word) {
                    while(next_word) {
                        if (cur_word[0].charAt(0) == next_word[0].charAt(0)) {
                            return exports.Instruction(
                                "GOTO", syllables, register
                            ); 
                        }
                        cur_word = next_word;
                        next_word = word_reg.exec(allit_line);
                    }
                }
                if (syllables === 0){
                    return exports.Instruction("NOOP", syllables, register);
                }
                return exports.Instruction("STORE", syllables, register);
            },
    };
})(this.AshPaper = {});

},{}],2:[function(require,module,exports){
(function (global){
AshPaper = require("./AshPaper.js").AshPaper;
var interpreter = AshPaper.Interpreter();

function rightpad(string, length) {
    if (length <= string.length) {
        return string;
    }
    return string + " ".repeat(length - string.length);
}

global.runProgram = function() {
    var output = "";
    var program = interpreter.interpret(
        document.getElementById('sourceCode').value);
    for(var i=1; i <= program.instructions.length; i++){
        program.execute_to(i);
        output += (
            rightpad( i - 1 + " >>   " + program.registers[0], 12) +
            rightpad("| " + program.registers[1], 8) +
            rightpad("| [" + program.stack._values + "]", 20) +
            ": " + program.output.replace(/\r?\n|\r/, "\\n") + "\n"
        );
    }
    document.getElementById('output').innerHTML = output;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AshPaper.js":1}]},{},[2]);
