'use strict';

function start() {
  Blockly.inject(document.getElementById('blocklyDiv'), 
      {
        toolbox: document.getElementById('toolbox')
      }
  );
  Blockly.addChangeListener(renderContent);
}

function renderContent() {
  var content = document.getElementById('code');
  var code = Blockly.cake.workspaceToCode();
  content.textContent = code;
  if (typeof prettyPrintOne == 'function') {
    code = content.innerHTML;
    code = prettyPrintOne(code, 'c');
    content.innerHTML = code;
  }
}