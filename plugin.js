/**
 * https://github.com/linder0209/tinymce-syntaxhighlighter
 * 自定义插件，基于 SyntaxHighlighter 代码高亮插件
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-28
 * */

/*global tinymce:true */

tinymce.PluginManager.add('syntaxhighlighter', function (editor, url) {
  var brushes = [
    {text: 'None', value: ''},
    {text: 'JavaScript', value: 'javascript'},
    {text: 'CSS', value: 'css'},
    {text: 'PHP', value: 'php'},
    {text: 'XML/XHTML', value: 'xml'},
    {text: 'Java', value: 'java'},
    {text: 'C++', value: 'cpp'},
    {text: 'C#', value: 'csharp'},
    {text: 'Delphi', value: 'delphi'},
    {text: 'AppleScript', value: 'applescript'},
    {text: 'ActionScript3', value: 'as3'},
    {text: 'Bash(Shell)', value: 'bash'},
    {text: 'Cold Fusion', value: 'coldfusion'},
    {text: 'Diff', value: 'diff'},
    {text: 'Erlang', value: 'erlang'},
    {text: 'Groovy', value: 'groovy'},
    {text: 'JavaFX', value: 'javafx'},
    {text: 'Perl', value: 'perl'},
    {text: 'Plain(Text)', value: 'plain'},
    {text: 'PowerShell', value: 'powershell'},
    {text: 'Python', value: 'python'},
    {text: 'Ruby', value: 'ruby'},
    {text: 'SASS', value: 'sass'},
    {text: 'Scala', value: 'scala'},
    {text: 'SQL', value: 'sql'},
    {text: 'VB', value: 'vb'},
    {text: 'Other', value: 'other'}
  ];

  function showDialog() {
    editor.windowManager.open({
      title: 'Insert Code',
      bodyType: 'tabpanel',
      body: [
        {
          type: 'form',
          layout: 'flex',
          padding: 10,
          title: 'Code',
          items: [
            {
              label: 'Code Language',
              name: 'brush',
              type: 'listbox',
              text: 'None',
              maxWidth: 200,
              values: brushes
            },
            {
              type: 'textbox',
              name: 'code',
              multiline: true,
              minWidth: editor.settings.syntaxhighlighter_dialog_width || 800,
              minHeight: editor.settings.syntaxhighlighter_dialog_height || Math.min(tinymce.DOM.getViewPort().h - 100, 450),
              spellcheck: false,
              style: 'direction: ltr; text-align: left;'
            }
          ]
        },
        {
          type: 'form',
          title: 'Settings',
          layout: 'flex',
          direction: 'column',
          labelGapCalc: 'children',
          padding: 20,
          items: [
            {
              type: 'form',
              labelGapCalc: false,
              padding: 0,
              layout: 'grid',
              columns: 2,
              defaults: {
                type: 'checkbox',
                maxWidth: 200
              },
              items: [
                {text: 'Display line numbers', name: 'gutter', checked: true},
                {text: 'Automatically make URLs clickable', name: 'autolinks', checked: true},
                {text: 'Use smart tabs allowing tabs being used for alignment', name: 'smarttabs', checked: true},
                {text: 'Quick code copy and paste from double click', name: 'quickcode', checked: true},
                {text: 'Display the toolbar', name: 'toolbar'},
                {text: 'Highlight a mixture of HTML/XML code and a script', name: 'htmlscript'},
                {text: 'Collapse code boxes', name: 'collapse'},
                {text: 'Use the light display mode, best for single lines of code', name: 'light'},
                {label: 'Starting Line Number', name: 'firstline', type: 'textbox', value: '1'},
                {label: 'Line Number Padding',
                  name: 'padlinenumbers',
                  type: 'listbox',
                  text: 'False',
                  values: [
                    {text: 'False', value: 'false'},
                    {text: 'True', value: 'true'},
                    {text: '3', value: '3'},
                    {text: '4', value: '4'},
                    {text: '5', value: '5'},
                    {text: '6', value: '6'}
                  ]},
                {label: 'Tab Size', name: 'tabsize', type: 'textbox', value: '4'},
                {label: 'Highlight Line(s)', name: 'highlight', type: 'textbox'},
                {label: 'Title', name: 'title', type: 'textbox'}
              ]
            }
          ]
        }
      ],
      onSubmit: function (e) {
        var win = this;
        if (e.data.code === '') {
          win.close();
          return;
        }
        //语言
        var brush = win.find('#brush').value() || 'plain';
        var config = 'brush: ' + brush + '; ';
        //显示行号，默认 true
        if (!win.find('#gutter').checked()) {
          config += 'gutter: false; ';
        }
        //加链接，默认true
        if (!win.find('#autolinks').checked()) {
          config += 'auto-links: false; ';
        }
        //只能缩进，默认 true
        if (!win.find('#smarttabs').checked()) {
          config += 'smart-tabs: false; ';
        }
        //双击是否选中代码，默认 true
        if (!win.find('#quickcode').checked()) {
          config += 'quick-code: false; ';
        }
        //显示工具栏，默认true
        if (!win.find('#toolbar').checked()) {
          config += 'toolbar: false; ';
        }
        //默认 false
        if (win.find('#htmlscript').checked()) {
          config += 'html-script: true; ';
        }
        //折叠代码，默认 false
        if (win.find('#collapse').checked()) {
          config += 'collapse: true; ';
        }
        //精简模式，默认false
        if (win.find('#light').checked()) {
          config += 'light: true; ';
        }

        //开始行值，默认为1
        var firstline = win.find('#firstline').value();
        if (firstline !== '1') {
          firstline = parseInt(firstline);
          config += 'first-line: ' + firstline + '; ';
        }
        //行号位数
        var padlinenumbers = win.find('#padlinenumbers').value();
        if (padlinenumbers !== 'false') {
          config += 'pad-line-numbers: ' + padlinenumbers + '; ';
        }
        //tab 大小，默认为 4
        var tabsize = win.find('#tabsize').value();
        if (tabsize !== '4') {
          config += 'tab-size: ' + tabsize + '; ';
        }
        //高亮行
        var highlight = win.find('#highlight').value();
        if (highlight !== '') {
          config += 'highlight: [' + highlight + ']; ';
        }
        //标题
        var title = win.find('#title').value();
        if (title !== '') {
          config += 'title: ' + title + '; ';
        }

        var content = '<pre class="' + config + '">';
        content += editor.dom.encode(e.data.code);
        content += '</pre>';
        content = '<p></p>' + content + '<p></p>';
        editor.execCommand('mceInsertContent', false, content);
      }
    });
  }

  editor.addCommand('mceSyntaxhighlighterEditor', showDialog);

  editor.addButton('syntaxhighlighter', {
    icon: 'insertcode',
    tooltip: 'Insert Code',
    onclick: showDialog
  });

  editor.addMenuItem('syntaxhighlighter', {
    icon: 'insertcode',
    tooltip: 'Insert Code',
    context: 'tools',
    onclick: showDialog
  });
});