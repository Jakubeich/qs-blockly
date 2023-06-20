var workspace = Blockly.inject("blocklyDiv", {
  toolbox: document.getElementById("toolbox"),
});

Blockly.Blocks['controls_if'] = {
  init: function() {
    this.appendStatementInput("IF0")
        .setCheck(null)
        .appendField("if")
        .appendField(new Blockly.FieldTextInput("condition"), "IF0");
    this.appendStatementInput("DO0")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['logic_compare'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendValueInput("B")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([["==","EQ"], ["<","LT"], ["<=","LTE"], [">","GT"], [">=","GTE"], ["!=","NEQ"]]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_repeat_ext'] = {
  init: function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("repeat");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['variables_set_int'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([["int", "INT"]]), "TYPE")
        .appendField(new Blockly.FieldDropdown([["=", "="]]), "OP");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

// Long block definition
Blockly.Blocks['variables_set_long'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField(new Blockly.FieldDropdown([["=", "="]]), "OP")
        .appendField(new Blockly.FieldDropdown([["long", "LONG"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

// Float block definition
Blockly.Blocks['variables_set_float'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField(new Blockly.FieldDropdown([["=", "="]]), "OP")
        .appendField(new Blockly.FieldDropdown([["float", "FLOAT"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

// Double block definition
Blockly.Blocks['variables_set_double'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField(new Blockly.FieldDropdown([["=", "="]]), "OP")
        .appendField(new Blockly.FieldDropdown([["double", "DOUBLE"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

// String block definition
Blockly.Blocks['variables_set_string'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("String")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField(new Blockly.FieldDropdown([["=", "="]]), "OP")
        .appendField(new Blockly.FieldDropdown([["string", "STRING"]]), "TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

Blockly.Cpp['controls_if'] = function(block) {
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Cpp.valueToCode(block, 'IF' + n,
      Blockly.Cpp.ORDER_NONE) || 'false';
    branchCode = Blockly.Cpp.statementToCode(block, 'DO' + n);
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
  } while (++n < block.elseifCount_);

  if (block.elseCount_) {
    branchCode = Blockly.Cpp.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Cpp['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Cpp.ORDER_EQUALITY : Blockly.Cpp.ORDER_RELATIONAL;
  var argument0 = Blockly.Cpp.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Cpp.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Cpp['controls_repeat_ext'] = function(block) {
  var repeats = Number(block.getFieldValue('TIMES'));
  var branch = Blockly.Cpp.statementToCode(block, 'DO');
  var loopVar = Blockly.Cpp.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for (int ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + repeats + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

// Int block generator
Blockly.Cpp['variables_set_int'] = function(block) {
  var value_input = Blockly.Cpp.valueToCode(block, 'VAR', Blockly.Cpp.ORDER_ATOMIC);
  var code = 'int ' + ' = ' + value_input + ';\n';
  return code;
};

// Long block generator
Blockly.Cpp['variables_set_long'] = function(block) {
  var variable_name = Blockly.Cpp.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_input = Blockly.Cpp.valueToCode(block, 'VALUE', Blockly.Cpp.ORDER_ATOMIC);
  var code = 'long ' + variable_name + ' = ' + value_input + 'L;\n';
  return code;
};

// Float block generator
Blockly.Cpp['variables_set_float'] = function(block) {
  var variable_name = Blockly.Cpp.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_input = Blockly.Cpp.valueToCode(block, 'VALUE', Blockly.Cpp.ORDER_ATOMIC);
  var code = 'float ' + variable_name + ' = ' + value_input + 'f;\n';
  return code;
};

// Double block generator
Blockly.Cpp['variables_set_double'] = function(block) {
  var variable_name = Blockly.Cpp.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_input = Blockly.Cpp.valueToCode(block, 'VALUE', Blockly.Cpp.ORDER_ATOMIC);
  var code = 'double ' + variable_name + ' = ' + value_input + ';\n';
  return code;
};

// String block generator
Blockly.Cpp['variables_set_string'] = function(block) {
  var variable_name = Blockly.Cpp.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_input = Blockly.Cpp.valueToCode(block, 'VALUE', Blockly.Cpp.ORDER_NONE);
  var code = 'string ' + variable_name + ' = ' + value_input + ';\n';
  return code;
};