const qscriptGenerator = new Blockly.Generator('QScript');

let workspace;

function start() {
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    variableTypes: ['int', 'long', 'float', 'string']
  });

  const xmlText = '<xml xmlns="http://www.w3.org/1999/xhtml">' + 
    '<block type="func_init" x="20" y="20"></block>' +
    '<block type="func_update" x="20" y="140"></block>' +
    '<block type="func_shutdown" x="20" y="260"></block>' +
    '</xml>';

  const xml = Blockly.Xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(xml, workspace);

  workspace.addChangeListener(renderContent);
}

function renderContent() {
  var content = document.getElementById('code');
  var code = qscriptGenerator.workspaceToCode(workspace);
  content.textContent = code;
  hljs.highlightBlock(content);
}

Blockly.Blocks['variables_declare'] = {
  init: function() {
    var input = this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("variable type")
        .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"], ["string","string"]]), "varType")
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myVariable"), "varName")
        .appendField("initial value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");

    this.getField('varType').setValidator(function(option) {
      var checkType = option === 'string' ? 'string' : ['int', 'float', 'long'];
      input.setCheck(checkType);
    });
  }
};

Blockly.Blocks['variables_get'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare') {
          let varName = block.getFieldValue('varName');
          options.push([varName, varName]);
        }
      }

      if (options.length === 0) {
        options.push(['', '']);
      }

      return options;
    });
    
    this.appendDummyInput()
        .appendField("")
        .appendField(dropdown, "VAR");
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['variables_set'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare') {
          let varName = block.getFieldValue('varName');
          options.push([varName, varName]);
        }
      }

      if (options.length === 0) {
        options.push(['', '']);
      }

      return options;
    });

       this.appendDummyInput()
           .appendField("set")
           .appendField(dropdown, "VAR")
           .appendField("to");
      this.appendValueInput("VALUE")
          .setCheck(null);
      this.setInputsInline(true);
       this.setPreviousStatement(true, null);
       this.setNextStatement(true, null);
       this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['func_init'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("int init:");
    this.appendStatementInput("func_init")
        .setCheck(null);
    this.appendValueInput("return_data")
        .setCheck(null)
        .appendField("return variable")
        .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"], ["string","string"]]), "VAR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['func_update'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("int update:");
    this.appendStatementInput("func_update")
        .setCheck(null);
    this.appendValueInput("return_data")
        .setCheck(null)
        .appendField("return variable")
        .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"], ["string","string"]]), "VAR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['func_shutdown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("int shutdown:");
    this.appendStatementInput("func_shutdown")
        .setCheck(null);
    this.appendValueInput("return_data")
        .setCheck(null)
        .appendField("return variable")
        .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"], ["string","string"]]), "VAR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "VALUE");
    this.setInputsInline(false);
    this.setOutput(true, ["int", "float", "long"]);
    this.setColour(20);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_arithmetic'] = {
  init: function() {
  this.appendValueInput("A")
  .setCheck(['int', 'float', 'long']);
  this.appendDummyInput()
  .appendField(new Blockly.FieldDropdown([["+","ADD"], ["-","SUBTRACT"], ["*","MULTIPLY"], ["/","DIVIDE"], ["%","MODULUS"]]), "operator");
  this.appendValueInput("B")
  .setCheck(['int', 'float', 'long']);
  this.setInputsInline(true);
  this.setOutput(true, ['int', 'float', 'long']);
  this.setColour(230);
  this.setTooltip("");
  this.setHelpUrl("");
  }
  };

Blockly.Blocks['text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("\"")
        .appendField(new Blockly.FieldTextInput(""), "VALUE")
        .appendField("\"");
    this.setOutput(true, ["string"]);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['functions_return'] = {
  init: function() {
    let dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(['func_init', 'func_update', 'func_shutdown'].includes(block.type)) {
          let funcName = block.type.split('_')[1];
          options.push([funcName, funcName]);
        }
      }

      if (options.length === 0) {
        options.push(['', '']);
      }

      return options;
    });

    this.appendDummyInput()
        .appendField(dropdown, "funcName");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_if'] = {
  init: function() {
    this.appendValueInput("if_input")
        .setCheck(['int', 'float', 'long', 'string'])
        .appendField("if");
    this.appendStatementInput("do_input")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['logic_operation'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(['int', 'long', 'float', 'string']);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["AND","AND"], ["OR","OR"], ["NOT","NOT"]]), "operator");
    this.appendValueInput("B")
        .setCheck(['int', 'long', 'float', 'string']);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['logic_compare'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(['int', 'long', 'float', 'string']);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["==","EQUALS"], ["!=","NOT_EQUALS"], ["<","LESS_THAN"], [">","MORE_THAN"], ["<=","LESS_THAN_OR_EQUAL"], [">=","MORE_THAN_OR_EQUAL"]]), "operator");
    this.appendValueInput("B")
        .setCheck(['int', 'long', 'float', 'string']);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_switch'] = {
  init: function() {
    this.appendValueInput("SWITCH")
        .setCheck(null)
        .appendField("switch");
    this.appendDummyInput()
        .appendField("if there are no corresponding value");
    this.appendStatementInput("DEFAULT_DO")
        .setCheck(null)
        .appendField("DO");
    this.appendDummyInput()
        .appendField("case");
    this.appendStatementInput("CASE_DO")
        .setCheck(null)
        .appendField("DO");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_for'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare') {
          let varName = block.getFieldValue('varName');
          options.push([varName, varName]);
        }
      }
      
      if (options.length === 0) {
        options.push(['', '']);
      }

      return options;
    });
    this.appendDummyInput()
        .appendField("repeat with")
        .appendField(dropdown, "VAR")
        .appendField("from");
    this.setInputsInline(true);
    this.appendValueInput("FROM")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("to");
    this.appendValueInput("TO")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("by");
    this.appendValueInput("BY")
        .setCheck(null);
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_doWhile'] = {
  init: function() {
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("do");
    this.appendValueInput("CONDITION")
        .setCheck(null)
        .appendField("repeat while");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

qscriptGenerator['variables_declare'] = function(block) {
  var targetBlock = block.getInputTargetBlock('NAME');
  var argument0 = targetBlock ? qscriptGenerator.blockToCode(targetBlock)[0] : '0';
  var varName = block.getFieldValue('varName');
  var varType = block.getFieldValue('varType');
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? qscriptGenerator.blockToCode(nextBlock) : '';

  workspace.createVariable(varName, varType);

  return varType + ' ' + varName + ' = ' + argument0 + ';\n' + nextCode;
};

qscriptGenerator['variables_get'] = function(block) {
  var varName = block.getFieldValue('VAR');
  return [varName, qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['variables_set'] = function(block) {
  var varName = block.getFieldValue('VAR');
  var argument = block.getInputTargetBlock('VALUE');
  var argument0 = argument ? qscriptGenerator.blockToCode(argument)[0] : '0';
  var code =  varName + ' = ' + argument0 + ';\n';

  return code;
};

qscriptGenerator['func_init'] = function(block) {
  var statements_func_init = qscriptGenerator.statementToCode(block, 'func_init');
  var varType = block.getFieldValue('VAR');
  var returnDataBlock = block.getInputTargetBlock('return_data');
  var returnData = returnDataBlock ? qscriptGenerator.blockToCode(returnDataBlock)[0] : getDefaultReturn(varType);

  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';
  
  var code = 'int init() {\n' +
             statements_func_init + '\n' +
             '  return ' + returnData + ';\n' +
             '}\n' + nextCode;

  return code;
};

qscriptGenerator['func_update'] = function(block) {
  var statements_func_update = qscriptGenerator.statementToCode(block, 'func_update');
  var varType = block.getFieldValue('VAR');
  var returnDataBlock = block.getInputTargetBlock('return_data');
  var returnData = returnDataBlock ? qscriptGenerator.blockToCode(returnDataBlock)[0] : getDefaultReturn(varType);
  
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';

  var code = 'int update() {\n' +
             statements_func_update + '\n' +
             '  return ' + returnData + ';\n' +
             '}\n' + nextCode;

  return code;
};

qscriptGenerator['func_shutdown'] = function(block) {
  var statements_func_shutdown = qscriptGenerator.statementToCode(block, 'func_shutdown');
  var varType = block.getFieldValue('VAR');
  var returnDataBlock = block.getInputTargetBlock('return_data');
  var returnData = returnDataBlock ? qscriptGenerator.blockToCode(returnDataBlock)[0] : getDefaultReturn(varType);
  
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';

  var code = 'int shutdown() {\n' +
             statements_func_shutdown + '\n' +
             '  return ' + returnData + ';\n' +
             '}\n' + nextCode;

  return code;
};

qscriptGenerator['math_number'] = function(block) {
  var number = block.getFieldValue('VALUE');
  return [number];
};

qscriptGenerator['math_arithmetic'] = function(block) {
  var operator = block.getFieldValue('operator');
  var value_a_block = block.getInputTargetBlock('A');
  var value_b_block = block.getInputTargetBlock('B');
  var value_a = value_a_block ? qscriptGenerator.blockToCode(value_a_block)[0] : '0';
  var value_b = value_b_block ? qscriptGenerator.blockToCode(value_b_block)[0] : '0';
  
  var code = '';
  switch (operator) {
    case 'ADD':
      code = value_a + ' + ' + value_b;
      break;
    case 'SUBTRACT':
      code = value_a + ' - ' + value_b;
      break;
    case 'MULTIPLY':
      code = value_a + ' * ' + value_b;
      break;
    case 'DIVIDE':
      code = value_a + ' / ' + value_b;
      break;
    case 'MODULUS':
      code = value_a + ' % ' + value_b;
      break;
    }
    return [code, qscriptGenerator.ORDER_ATOMIC];
  };

qscriptGenerator['text'] = function(block) {
  var text = block.getFieldValue('VALUE');
  text = text.replace(/"/g, '\\"');
  return ['"' + text + '"', qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['functions_return'] = function(block) {
  var funcName = block.getFieldValue('funcName');
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? qscriptGenerator.blockToCode(nextBlock) : '';
  return funcName + '();\n' + nextCode;
};

qscriptGenerator['controls_switch'] = function(block) {
  var switch_block = block.getInputTargetBlock('SWITCH');
  var switch_code = switch_block ? qscriptGenerator.blockToCode(switch_block, 'SWITCH')[0] : '0';
  var default_do_code = qscriptGenerator.statementToCode(block, 'DEFAULT_DO');
  var case_do_code = qscriptGenerator.statementToCode(block, 'CASE_DO');

  default_do_code = '  ' + default_do_code.replace(/\n/g, '\n  ');
  case_do_code = '  ' + case_do_code.replace(/\n/g, '\n  ');

  var code = 'switch(' + switch_code + ') {\n' + '  default:\n' + default_do_code + 'case 1:\n' + case_do_code + '}\n';
  return code;
};

qscriptGenerator['controls_if'] = function(block) {
  var return_block_if = block.getInputTargetBlock('if_input'); 
  var value_if = return_block_if ? qscriptGenerator.blockToCode(return_block_if)[0] : 0;
  var value_do = block.getInputTargetBlock('do_input') ? qscriptGenerator.statementToCode(block, 'do_input') : '';

  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';

  var code = 'if (' + value_if + ') {\n' +
              value_do +
              '}\n' + nextCode;
  return code;
};

qscriptGenerator['logic_operation'] = function(block) {
  var operator = block.getFieldValue('operator');
  var value_a_block = block.getInputTargetBlock('A');
  var value_b_block = block.getInputTargetBlock('B');
  var value_a = value_a_block ? qscriptGenerator.blockToCode(value_a_block)[0] : '0';
  var value_b = value_b_block ? qscriptGenerator.blockToCode(value_b_block)[0] : '0';

  var code = '';
  switch (operator) {
    case 'AND':
      code = value_a + ' && ' + value_b;
      break;
    case 'OR':
      code =  value_a + ' || ' + value_b;
      break;
    case 'NOT':
      code = '!' + value_a;
      break;
  }
  return [code, qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['logic_compare'] = function(block) {
  var operator = block.getFieldValue('operator');
  var value_a_block = block.getInputTargetBlock('A');
  var value_b_block = block.getInputTargetBlock('B');
  var value_a = value_a_block ? qscriptGenerator.blockToCode(value_a_block)[0] : '0';
  var value_b = value_b_block ? qscriptGenerator.blockToCode(value_b_block)[0] : '0';

  var code = '';
  switch (operator) {
    case 'EQUALS':
      code = value_a + ' == ' + value_b;
      break;
    case 'NOT_EQUALS':
      code = value_a + ' != ' + value_b;
      break;
    case 'LESS_THAN':
      code = value_a + ' < ' + value_b;
      break;
    case 'MORE_THAN':
      code = value_a + ' > ' + value_b;
      break;
    case 'LESS_THAN_OR_EQUAL':
      code = value_a + ' <= ' + value_b;
      break;
    case 'MORE_THAN_OR_EQUAL':
      code = value_a + ' >= ' + value_b;
      break;
  }
  return [code, qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['controls_for'] = function(block) {
  var variable_name = block.getFieldValue('VAR');
  var from_value_block = block.getInputTargetBlock('FROM');
  var to_value_block = block.getInputTargetBlock('TO');
  var by_value_block = block.getInputTargetBlock('BY');
  var statements_do = qscriptGenerator.statementToCode(block, 'DO');

  var from_value = from_value_block ? qscriptGenerator.blockToCode(from_value_block)[0] : '0';
  var to_value = to_value_block ? qscriptGenerator.blockToCode(to_value_block)[0] : '0';
  
  var by_value = by_value_block;
  if (by_value == null) {
    var code = 'for(' + variable_name + ' = ' + from_value + '; ' + variable_name + ' < ' + to_value + '; ' + variable_name + '++' + ') {\n' + statements_do + '\n}\n';
    return code;
  } else {
    by_value = qscriptGenerator.blockToCode(by_value_block)[0];
    var code = 'for(' + variable_name + ' = ' + from_value + '; ' + variable_name + ' < ' + to_value + '; ' + variable_name + ' += ' + by_value + ') {\n' + statements_do + '\n}\n';
    return code;
  }
};

qscriptGenerator['controls_doWhile'] = function(block) {
  var statements_do = qscriptGenerator.statementToCode(block, 'DO');
  var condition_block = block.getInputTargetBlock('CONDITION');
  var condition = condition_block ? qscriptGenerator.blockToCode(condition_block)[0] : 0;
  
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';
  
  var code = 'do {\n' + 
             statements_do + 
             '} while(' + condition + ');\n' + nextCode;
  return code;
};

function getDefaultReturn(varType) {
  switch (varType) {
    case 'string':
      return '""';
    case 'int':
    case 'long':
    case 'float':
      return '0';
    default:
      return 'null';
  }
}