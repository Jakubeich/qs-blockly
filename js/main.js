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
    this.appendValueInput("NAME")
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
  },
  onchange: function(event) {
    if (event.type == Blockly.Events.BLOCK_CHANGE && event.element == 'field') {
      let varName = this.getFieldValue('varName');
      let varType = this.getFieldValue('varType');
      let newVariable = workspace.createVariable(varName, varType);
  
      // Aktualizujeme pole FieldVariable všech bloků 'variables_get'.
      let allBlocks = workspace.getAllBlocks();
      for(let block of allBlocks) {
        if(block.type === 'variables_get') {
          let fieldVariable = block.getField('VAR');
          if(fieldVariable) {
            fieldVariable.setValue(newVariable.getId());
          }
        }
      }
    }
  }
};

Blockly.Blocks['variables_get'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let variables = workspace.getAllVariables();
      let options = [];
      for(let variable of variables) {
        options.push([variable.name, variable.name]);
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
    this.setColour(230);
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
    this.setColour(230);
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
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "VALUE");
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "VALUE");
    this.setOutput(true, null);
    this.setColour(230);
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

  return code = varType + ' ' + varName + ' = ' + argument0 + ';\n' + nextCode;
};

qscriptGenerator['variables_get'] = function(block) {
  var varName = block.getFieldValue('VAR');
  return [varName, qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['func_init'] = function(block) {
  var statements_func_init = qscriptGenerator.statementToCode(block, 'func_init');
  var varType = block.getFieldValue('VAR');
  var returnDataBlock = block.getInputTargetBlock('return_data');
  var returnData = returnDataBlock ? qscriptGenerator.blockToCode(returnDataBlock)[0] : getDefaultReturn(varType);

  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';
  
  var code = 'int init() {\n' +
             statements_func_init +
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
             statements_func_update +
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
             statements_func_shutdown +
             '  return ' + returnData + ';\n' +
             '}\n' + nextCode;

  return code;
};

qscriptGenerator['math_number'] = function(block) {
  var number = block.getFieldValue('VALUE');
  return [number];
};

qscriptGenerator['text'] = function(block) {
  var text = block.getFieldValue('VALUE');
  // Je nutné escapovat uvozovky v textu, aby nedošlo k chybě v generovaném kódu.
  text = text.replace(/"/g, '\\"');
  return ['"' + text + '"', qscriptGenerator.ORDER_ATOMIC];
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