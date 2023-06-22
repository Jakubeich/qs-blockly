Blockly.Blocks['variables_declare'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("variable type")
        .appendField(new Blockly.FieldDropdown([["int","integer"], ["long","long"], ["float","float"], ["string","string"]]), "varType")
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myVariable"), "varName")
        .appendField("initial value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};