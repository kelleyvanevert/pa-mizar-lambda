
var _N = 0,
    uid = function () {
      return _N++;
    },
    collapseProofs = function (codeLines) {
      var m,
          indent = 0;

      for (var i = 0, line; i < codeLines.length; i++) {
        line = codeLines[i];
        if (m = line.match(/^(.*)<span class=['"]keyword['"]>(proof|suppose)<\/span>(.*)$/)) {
          if (indent == 0) {
            codeLines[i] = m[1] +
              '<a class="keyword toggle-collapsible" href="#">' + m[2] + '</a>' +
              '<span class="collapsible">' +
              m[3];
          }
          indent++;
        } else if (m = line.match(/^(.*)<span class=['"]keyword['"]>end<\/span>(.*)$/)) {
          if (indent >= 1) {
            indent--;
            if (indent == 0) {
              codeLines[i] = m[1] + '<span class="keyword">end</span></span>' + m[2];
            }
          }
        }
      }
    },
    voc = [
      /^ *func (?:\([^\)]*\))?([^\( ]+).*$/,
      /^ *([a-zA-Z]+) ->.*$/,
      /^ *struct ([a-zA-Z-]+).*$/,
      /^ *attr [a-zA-Z] is (?:(?:[a-zA-Z],)*[a-zA-Z](?=-))?([a-zA-Z-]+) .*$/,
      /^ *mode ([a-zA-Z-]+).*$/,
      /^ *pred (?:[a-zA-Z] )*([^ ]{2,}) .*$/
    ];

module.exports = {
  afterCodeHighlight: function (codeLines) {
    collapseProofs(codeLines);
  },
  afterFragmentDiscovery: function (fragments) {
    var m,
        vocabulary;

    for (var i = 0; i < fragments.length; i++) {
      if (fragments[i].type == "heading") {
        vocabulary = fragments[i].vocabulary = [];
      }

      for (var j = 0; j < fragments[i].code.length; j++) {
        for (var k = 0; k < voc.length; k++) {
          if (m = fragments[i].code[j].match(voc[k])) {
            vocabulary.push({
              line: fragments[i].codeLineNo + j,
              name: m[1]
            });
          }
        }
      }
    }
  }
};
