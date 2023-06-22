const qscriptGenerator = new Blockly.Generator('QScript');

qscriptGenerator.PRECEDENCE = 0;

qscriptGenerator['variables_declare'] = function(block) {
  var argument0 = qscriptGenerator.valueToCode(block, 'VALUE',
          qscriptGenerator.ORDER_ASSIGNMENT) || '0';
  var varName = qscriptGenerator.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varType = block.getFieldValue('TYPES');

  return varType + ' ' + varName + ' = ' + argument0 + ';\n';
};