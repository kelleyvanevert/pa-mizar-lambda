
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
      ["func", /^ *func \(?(?:[a-zA-Z](?:, ?[a-zA-Z])*\)? )?([^\( ]{2,}).*$/],
      ["selector", /^ *([a-zA-Z]+) ->.*$/],
      ["struct", /^ *struct ([a-zA-Z-]+).*$/],
      ["attr", /^ *attr [a-zA-Z] is (?:(?:[a-zA-Z],)*[a-zA-Z](?=-))?([a-zA-Z-]+) .*$/],
      ["mode", /^ *mode ([a-zA-Z-]+).*$/],
      ["pred", /^ *pred (?:[a-zA-Z](?:, ?[a-zA-Z])* )?([^ ]{2,}) .*$/]
    ],
    discoverVocabulary = function (fragments) {
      var m,
          vocabulary;

      for (var i = 0; i < fragments.length; i++) {
        if (fragments[i].type == "heading") {
          vocabulary = fragments[i].vocabulary = [];
        }

        for (var j = 0; j < fragments[i].code.length; j++) {
          for (var k = 0; k < voc.length; k++) {
            if (m = fragments[i].code[j].match(voc[k][1])) {
              vocabulary.push({
                type: voc[k][0],
                line: fragments[i].codeLineNo + j,
                name: m[1]
              });
            }
          }
        }
      }
    },
    Heading = (function () {

      var Heading = function (x) {
        if (x instanceof Heading) {
          var parent = this.parent.x;
          this.depth = this.parent.depth + 1;
          this.children = [];
          this.parent.children.push(this);
          this.title = "[No title]";
          this.vocabulary = [];
          this.lineNo = -1;
        } else {
          var fragment = x,
              m = fragment.docs[0].match(/^(#{1,6}) *(.*)$/);

          this.depth = m[1].length;
          this.title = m[2];
          this.children = [];
          this.vocabulary = fragment.vocabulary;
          this.lineNo = fragment.codeLineNo;

          fragment.heading = this;
        }
      };

      Heading.prototype.add = function (heading) {
        if (heading.depth > this.depth) {
          if (heading.depth > this.depth + 1) {
            var child = new Heading(this);
            return child.add(heading);
          } else {
            var child = heading;
            this.children.push(child);
            child.parent = this;
            return child;
          }
        } else {
          if (this.parent) {
            return this.parent.add(heading);
          } else {
            console.log("cannot add heading!");
          }
        }
      };

      Heading.prototype.debugPrint = function () {
        var hn = this.headNumber(true),
            voc = this.vocabulary.map(function (v) {
              return v.name;
            }).join(", ");

        console.log((hn ? hn + " " : "") + this.title + (voc ? "  (" + voc + ")" : ""));
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].debugPrint();
        };
      };

      Heading.prototype.headNumber = function (indent) {
        if (!this.parent) {
          return "";
        } else {
          var phn = this.parent.headNumber(indent),
              i = this.parent.children.indexOf(this) + 1,
              hn = (phn == "") ? i : phn + "." + i;

          return indent ? (Array(phn.length + 1) .join(" ") + hn) : hn;
        }
      };

      return Heading;
    }()),
    discoverStructure = function (fragments) {
      var m,
          fragment,
          current = fragments.structure = new Heading(fragments[0]);

      for (var i = 1; i < fragments.length; i++) {
        if ((fragment = fragments[i]).type == "heading") {
          var heading = new Heading(fragment);
          current = current.add(heading);
        }
      }
    };

module.exports = {
  afterCodeHighlight: function (codeLines) {
    collapseProofs(codeLines);
  },
  afterFragmentDiscovery: function (fragments) {
    discoverVocabulary(fragments);
    discoverStructure(fragments);
    fragments.structure.debugPrint();
  }
};
