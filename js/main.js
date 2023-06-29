const qscriptGenerator = new Blockly.Generator('QScript');

let workspace;
let isFullscreen = false;

function start() {
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    }
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

function toggleFullscreen() {
  const blocklyDiv = document.getElementById('blocklyDiv');
  const codeDiv = document.querySelector('.codeDiv');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (isFullscreen) {
    blocklyDiv.style.height = '60%';
    blocklyDiv.style.width = '50%';
    blocklyDiv.style.display = 'inline-block';

    codeDiv.style.display = 'inline-block';
    fullscreenBtn.innerText = 'Fullscreen';
  } else {
    blocklyDiv.style.height = '95%';
    blocklyDiv.style.width = '70%';
    blocklyDiv.style.display = 'inline-block';

    codeDiv.style.display = 'inline-block';
    fullscreenBtn.innerText = 'Exit Fullscreen';
  }

  isFullscreen = !isFullscreen;
  Blockly.svgResize(workspace);
}

document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

///////////////////////////////////////////////////////////////////////// BLOCKS DEFINITIONS /////////////////////////////////////////////////////////////////////////

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

Blockly.Blocks['procedures_defreturn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myFunction"), "NAME")
    this.appendStatementInput("DO")
        .setCheck(null);
    this.appendValueInput("return_data")
      .setCheck(null)
      .appendField("return variable")
      .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"], ["string","string"]]), "VAR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['func_init'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("int init:");
    this.appendStatementInput("func_init", "NAME")
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
    this.appendStatementInput("func_update", "NAME")
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
    this.appendStatementInput("func_shutdown", "NAME")
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

Blockly.Blocks['functions_get'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let options = [
        ["func_init", "func_init"],
        ["func_update", "func_update"],
        ["func_shutdown", "func_shutdown"]
      ];

      let blocks = workspace.getAllBlocks();
      for(let block of blocks) {
        if(block.type === 'procedures_defreturn') {
          let funcName = block.getFieldValue('NAME');
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

Blockly.Blocks['variables_declare_array'] = {
  init: function() {
    var input = this.appendValueInput("NAME")
        .appendField("array, type")
        .appendField(new Blockly.FieldDropdown([["int","int"], ["long","long"], ["float","float"]]), "varType")
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myArray"), "varName")
        .appendField("lenght");
    this.appendDummyInput();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");

  this.getField('varType').setValidator(function(option) {
    var checkType = option === 'string' ? 'string' : ['int', 'float', 'long'];
    input.setCheck(checkType);
  });
  }
};

Blockly.Blocks['variables_get_array'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare_array') {
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
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['variables_set_array'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare_array') {
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
    this.appendDummyInput()
        .appendField("to");
    this.appendValueInput("VALUE")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("");
  }
};

Blockly.Blocks['array_length'] = {
  init: function() {
    var dropdown = new Blockly.FieldDropdown(function() {
      let blocks = workspace.getAllBlocks();
      let options = [];
      for(let block of blocks) {
        if(block.type === 'variables_declare_array') {
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
        .appendField("length of")
        .appendField(dropdown, "VAR");
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['array_list'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("int")
        .appendField("create list with");

    this.setMutator(new Blockly.Mutator(['array_list_item']));
    this.itemCount_ = 0;

    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('array_list_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('array_list_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 1; i <= this.itemCount_; i++) {
      var input = this.getInput('VALUE' + i);
      if (input && connections[i - 1]) {
          if (connections[i - 1].targetConnection) {
              input.connection.connect(connections[i - 1].targetConnection);
          } else {
              connections[i - 1] = input.connection;
          }
      }
    }
  },
  
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('VALUE' + i);
      if (input) {
        itemBlock.valueConnection_ = input.connection;
      }
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('VALUE' + (i + 1))) {
        this.appendValueInput('VALUE' + (i + 1)).setCheck("int");
      }
    }
    while (this.getInput('VALUE' + (this.itemCount_ + 1))) {
      this.removeInput('VALUE' + (this.itemCount_ + 1));
    }
  },
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
    this.appendStatementInput("CASE_DO_1")
        .setCheck(null)
        .appendField("DO");

    this.setMutator(new Blockly.Mutator(['controls_switch_case']));
    this.caseCount_ = 1;

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('cases', this.caseCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.caseCount_ = parseInt(xmlElement.getAttribute('cases'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('controls_switch_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.caseCount_; i++) {
      var caseBlock = workspace.newBlock('controls_switch_case');
      caseBlock.initSvg();
      connection.connect(caseBlock.previousConnection);
      connection = caseBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var caseBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (caseBlock) {
      connections.push(caseBlock.statementConnection_);
      caseBlock = caseBlock.nextConnection && caseBlock.nextConnection.targetBlock();
    }
    this.caseCount_ = connections.length;
    this.updateShape_();
    for (var i = 1; i <= this.caseCount_; i++) {
      var input = this.getInput('CASE_DO_' + i);
      if (input && connections[i - 1]) {
        if (connections[i - 1].targetConnection) {
          input.connection.connect(connections[i - 1].targetConnection);
        } else {
          connections[i - 1] = input.connection;
        }
      }
    }
  },

  saveConnections: function(containerBlock) {
    var caseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 1;
    while (caseBlock) {
      var input = this.getInput('CASE_DO_' + i);
      if (input) {
        caseBlock.statementConnection_ = input.connection;
      }
      i++;
      caseBlock = caseBlock.nextConnection && caseBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    for (var i = 1; i <= this.caseCount_; i++) {
      if (!this.getInput('CASE_DO_' + i)) {
        this.appendStatementInput('CASE_DO_' + i)
          .setCheck(null)
          .appendField("DO");
      }
    }
    while (this.getInput('CASE_DO_' + (this.caseCount_ + 1))) {
      this.removeInput('CASE_DO_' + (this.caseCount_ + 1));
    }
  },
};

Blockly.Blocks['controls_switch_container'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField("cases");
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_switch_case'] = {
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField("case");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks['array_list_container'] = {
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendField("list items");
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  }
};

Blockly.Blocks['array_list_item'] = {
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendField("item");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  }
};

///////////////////////////////////////////////////////////////////////// GENERATOR ///////////////////////////////////////////////////////////////////////// 

qscriptGenerator['array_list'] = function(block) {
  var inicial_block = block.getInputTargetBlock('VALUE');
  var inicial_code = inicial_block ? qscriptGenerator.blockToCode(inicial_block)[0] : '0';
  var i = 0;

  var code = '( ' + inicial_code;
  while (block.getInput('VALUE' + (i + 1))) {
    var value_block = block.getInputTargetBlock('VALUE' + (i + 1));
    var value_code = value_block ? qscriptGenerator.blockToCode(value_block)[0] : '0';
    code += ', ' + value_code;
    i++;
  }

  code += ' )';

  return [code, qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['array_length'] = function(block) {
  var varName = block.getFieldValue('VAR');
  return [varName + '.length', qscriptGenerator.ORDER_ATOMIC];
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

qscriptGenerator['variables_declare_array'] = function(block) {
  var varName = block.getFieldValue('varName');
  var varType = block.getFieldValue('varType');
  var arrayLength = block.getInputTargetBlock('NAME');
  var arrayLengthCode = arrayLength ? qscriptGenerator.blockToCode(arrayLength)[0] : '0';
  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? qscriptGenerator.blockToCode(nextBlock) : '';

  var code = varType + ' ' + varName + '[' + arrayLengthCode + '];\n' + nextCode;
  return code;
};

qscriptGenerator['variables_get_array'] = function(block) {
  var varName = block.getFieldValue('VAR');
  var arrayLengthCode = getArrayLength(varName);

  return [varName + "[" + arrayLengthCode + "]", qscriptGenerator.ORDER_ATOMIC];
};

qscriptGenerator['variables_set_array'] = function(block) {
  var varName = block.getFieldValue('VAR');
  var arrayLengthCode = getArrayLength(varName); 
  var valueBlock = block.getInputTargetBlock('VALUE');
  var value = valueBlock ? qscriptGenerator.blockToCode(valueBlock)[0] : '0';

  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';

  var code = varName + "[" + arrayLengthCode + "]" + ' = ' + value + ';' + nextCode;
  return code;
};

qscriptGenerator['functions_get'] = function(block) {
  var funcName = block.getFieldValue('funcName')
  return code = funcName + '();\n';
};

qscriptGenerator["procedures_defreturn"] = function(block) {
  var funcName = block.getFieldValue('NAME');
  var statements_do = qscriptGenerator.statementToCode(block, 'DO');
  var varType = block.getFieldValue('VAR');
  var returnDataBlock = block.getInputTargetBlock('return_data');

  var returnData = returnDataBlock ? qscriptGenerator.blockToCode(returnDataBlock)[0] : getDefaultReturn(varType);

  var nextBlock = block.getNextBlock();
  var nextCode = nextBlock ? '\n' + qscriptGenerator.blockToCode(nextBlock) : '';

  var code = "int" + ' ' + funcName + '() {\n' +
              statements_do + '\n' +
              '  return ' + returnData + ';\n' +
              '}\n' + nextCode;
  
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

qscriptGenerator['controls_switch'] = function(block) {
  var switch_block = block.getInputTargetBlock('SWITCH');
  var switch_code = switch_block ? qscriptGenerator.blockToCode(switch_block, 'SWITCH')[0] : '0';

  var default_do_code = qscriptGenerator.statementToCode(block, 'DEFAULT_DO');

  var code = 'switch(' + switch_code + ') {\n' + '  default:\n' + '  ' + default_do_code;

  // then set cases
  var i = 1;
  while (block.getInput('CASE_DO_' + i)) {
    var case_do_code = qscriptGenerator.statementToCode(block, 'CASE_DO_' + i);
    code += '  case ' + i + ':\n' + '    ' + case_do_code;
    i++;
  }

  code += '}\n';
  
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

///////////////////////////////////////////////////////////////////////// Helper functions ///////////////////////////////////////////////////////////////////////// 
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

function getArrayLength(varName) {
  let blocks = workspace.getAllBlocks();
  for(let block of blocks) {
    if(block.type === 'variables_declare_array' && block.getFieldValue('varName') === varName) {
      let arrayLength = block.getInputTargetBlock('NAME');
      return arrayLength ? qscriptGenerator.blockToCode(arrayLength)[0] : '0';
    }
  }
  return '0';
}