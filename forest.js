// Generated by LiveScript 1.2.0
//
var Node, Tree, minMapping, EditDistance, DELIM, parse, $, diag, BLANK, ref$, drawTree, miniForest, $s, parseAndDraw, COST, diff, i$, len$, el, slice$ = [].slice, replace$ = ''.replace;
Node = (function(){
  Node.displayName = 'Node';
  var prototype = Node.prototype, constructor = Node;
  function Node(){
    this.children = [];
    this.label = '';
  }
  prototype.deepCopy = function(){
    var x$, ref$;
    x$ = new Node;
    import$(x$, this);
    x$.children = (ref$ = this.children) != null ? ref$.map(function(it){
      return it.deepCopy();
    }) : void 8;
    return x$;
  };
  return Node;
}());
Tree = (function(){
  Tree.displayName = 'Tree';
  var prototype = Tree.prototype, constructor = Tree;
  function Tree(root){
    var x$, i$, y$, ref$, len$, n, stack, frame, node, children, child, z$;
    x$ = this.root = root;
    x$.keyRoot = true;
    this.nodes = [];
    this.keyRoots = [root];
    for (i$ = 0, len$ = (ref$ = root.children.slice(1).reverse()).length; i$ < len$; ++i$) {
      y$ = ref$[i$];
      y$.keyRoot = true;
      this.keyRoots.unshift(y$);
    }
    n = 0;
    stack = [[root, root.children.slice()]];
    while (stack.length > 0) {
      ref$ = frame = stack.pop(), node = ref$[0], children = ref$[1];
      if (children.length > 0) {
        child = children.shift();
        for (i$ = 0, len$ = (ref$ = child.children.slice(1).reverse()).length; i$ < len$; ++i$) {
          z$ = ref$[i$];
          z$.keyRoot = true;
          this.keyRoots.unshift(z$);
        }
        stack.push(frame, [child, child.children.slice()]);
      } else {
        this.nodes.push(node);
        node.postorder = n++;
        node.leftmost = node.children.length > 0 ? node.children[0].leftmost : node;
      }
    }
    this.size = n;
  }
  return Tree;
}());
minMapping = function(){
  var choices, min, minM, i$, len$, ref$, m, cost;
  choices = slice$.call(arguments);
  min = choices[0][1];
  minM = choices[0][0];
  for (i$ = 0, len$ = choices.length; i$ < len$; ++i$) {
    ref$ = choices[i$], m = ref$[0], cost = ref$[1];
    if (cost < min) {
      min = cost;
      minM = m;
    }
  }
  return [minM, min];
};
EditDistance = (function(){
  EditDistance.displayName = 'EditDistance';
  var prototype = EditDistance.prototype, constructor = EditDistance;
  function EditDistance(a, b, cost){
    var deletion, insertion, renaming, res$, i$, to$, i, lresult$, j$, to1$, j, lresult1$, ref$, len$, kr1, lresult2$, ref1$, len1$, kr2, fd, res1$, k$, l$, ref2$;
    deletion = cost.deletion, insertion = cost.insertion, renaming = cost.renaming;
    res$ = [];
    for (i$ = 0, to$ = a.size; i$ <= to$; ++i$) {
      i = i$;
      lresult$ = [];
      for (j$ = 0, to1$ = b.size; j$ <= to1$; ++j$) {
        j = j$;
        lresult$.push(j * insertion);
      }
      res$.push(lresult$);
    }
    this.td = res$;
    res$ = [];
    for (i$ = 0, to$ = a.size; i$ <= to$; ++i$) {
      i = i$;
      lresult1$ = [];
      for (j$ = 0, to1$ = b.size; j$ <= to1$; ++j$) {
        j = j$;
        lresult1$.push('i');
      }
      res$.push(lresult1$);
    }
    this.backtrace = res$;
    for (i$ = 1, to$ = this.td.length; i$ < to$; ++i$) {
      i = i$;
      this.td[i][0] = i * deletion;
      this.backtrace[i][0] = 'd';
    }
    this.backtrace[0][0] = 'r';
    res$ = [];
    for (i$ = 0, len$ = (ref$ = a.keyRoots).length; i$ < len$; ++i$) {
      kr1 = ref$[i$];
      lresult2$ = [];
      for (j$ = 0, len1$ = (ref1$ = b.keyRoots).length; j$ < len1$; ++j$) {
        kr2 = ref1$[j$];
        res1$ = [];
        for (k$ = 0, to$ = a.size; k$ <= to$; ++k$) {
          i = k$;
          res1$.push([]);
        }
        fd = res1$;
        fd[kr1.leftmost.postorder][kr2.leftmost.postorder] = 0;
        for (k$ = kr1.leftmost.postorder + 1, to$ = kr1.postorder + 1; k$ <= to$; ++k$) {
          i = k$;
          fd[i][kr2.leftmost.postorder] = fd[i - 1][kr2.leftmost.postorder] + deletion;
        }
        for (k$ = kr2.leftmost.postorder + 1, to$ = kr2.postorder + 1; k$ <= to$; ++k$) {
          j = k$;
          fd[kr1.leftmost.postorder][j] = fd[kr1.leftmost.postorder][j - 1] + insertion;
        }
        for (k$ = kr1.leftmost.postorder + 1, to$ = kr1.postorder + 1; k$ <= to$; ++k$) {
          i = k$;
          for (l$ = kr2.leftmost.postorder + 1, to1$ = kr2.postorder + 1; l$ <= to1$; ++l$) {
            j = l$;
            if (kr1.leftmost.leftmost === kr1.leftmost && kr2.leftmost.leftmost === kr2.leftmost) {
              ref2$ = minMapping(['d', fd[i - 1][j] + deletion], ['i', fd[i][j - 1] + insertion], ['r', fd[i - 1][j - 1] + renaming(a.nodes[i - 1], b.nodes[j - 1])]), this.backtrace[i][j] = ref2$[0], fd[i][j] = ref2$[1];
              this.td[i][j] = fd[i][j];
            } else {
              fd[i][j] = Math.min(fd[i - 1][j] + deletion, fd[i][j - 1] + insertion, fd[a.nodes[i - 1].leftmost.postorder][b.nodes[j - 1].leftmost.postorder] + td[i][j]);
            }
          }
        }
        lresult2$.push(fd);
      }
      res$.push(lresult2$);
    }
    this.fd = res$;
    this.distance = this.td[a.size][b.size];
    this.mapping = [];
    this.amap = {};
    this.bmap = {};
    this.trace = [];
    i = a.size;
    j = b.size;
    while (i >= 0 && j >= 0) {
      this.trace.push([i, j]);
      switch (this.backtrace[i][j]) {
      case 'r':
        if (i > 0 && j > 0) {
          this.mapping.push([a.nodes[i - 1], b.nodes[j - 1]]);
          this.amap[i - 1] = j - 1;
          this.bmap[j - 1] = i - 1;
        }
        --i;
        --j;
        break;
      case 'i':
        if (j > 0) {
          this.mapping.push([null, b.nodes[j - 1]]);
          this.bmap[j - 1] = null;
        }
        --j;
        break;
      case 'd':
        if (i > 0) {
          this.mapping.push([a.nodes[i - 1], null]);
          this.amap[i - 1] = null;
        }
        --i;
        break;
      default:
        throw [i, j];
      }
    }
  }
  return EditDistance;
}());
DELIM = {
  ']': '[',
  ')': '(',
  '}': '{'
};
parse = function(text){
  var dstack, pstack, i$, ref$, len$, c, node, delimiter;
  dstack = [];
  pstack = [new Node];
  for (i$ = 0, len$ = (ref$ = replace$.call(text, /\s+/g, '')).length; i$ < len$; ++i$) {
    c = ref$[i$];
    switch (c) {
    case '[':
    case '{':
    case '(':
      dstack.push(c);
      node = new Node;
      pstack[pstack.length - 1].children.push(node);
      pstack.push(node);
      break;
    case ']':
    case '}':
    case ')':
      if (pstack.length === 1 || dstack[dstack.length - 1] !== DELIM[c]) {
        throw new Error("unexpected '" + c + "'");
      }
      pstack.pop();
      delimiter = dstack.pop();
      break;
    default:
      pstack[pstack.length - 1].label += c;
    }
  }
  if (pstack.length > 1) {
    throw new Error("missing closing '" + dstack[dstack.length - 1] + "'");
  }
  return new Tree(pstack[0]);
};
$ = bind$(document, 'getElementById');
diag = d3.svg.diagonal();
BLANK = (ref$ = new Node, ref$.label = '', ref$.postorder = '', ref$);
drawTree = function(ast, svg){
  var t, nodes, links, x$, y$, z$, z1$, z2$;
  t = d3.layout.tree().size([500, 500]);
  nodes = t.nodes(ast.root);
  links = t.links(nodes);
  x$ = svg;
  y$ = x$.select('.nodes').selectAll('.node').data(nodes);
  y$.exit().remove();
  z$ = y$.enter().append('g').attr({
    'class': 'node'
  });
  z$.append('circle').attr({
    'class': 'node-circle',
    r: 20
  });
  z1$ = z$.append('text').attr({
    'class': 'node-text'
  });
  z1$.append('tspan').attr({
    'class': 'node-label'
  });
  z1$.append('tspan').attr({
    'class': 'node-postorder',
    dy: 5
  });
  y$.attr({
    transform: function(it){
      return "translate(" + it.x + ", " + it.y + ")";
    },
    'data-postorder': function(it){
      return it.postorder;
    }
  });
  y$.classed('key-root', function(it){
    return it.keyRoot;
  });
  y$.select('.node-label').text(function(it){
    return it.label;
  });
  y$.select('.node-postorder').text(function(it){
    return it.postorder;
  });
  z2$ = x$.select('.links').selectAll('.link').data(links);
  z2$.exit().remove();
  z2$.enter().append('path').attr('class', 'link');
  z2$.attr('d', diag);
};
miniForest = curry$(function(tree, node){
  var i, t, nodes, links, x$, y$, z$, z1$, z2$;
  if (node === BLANK) {
    return;
  }
  i = node.postorder;
  t = d3.layout.tree().size([50, 50]);
  nodes = t.nodes(tree.root.deepCopy());
  links = t.links(nodes).filter(function(it){
    return it.source.postorder <= i && it.target.postorder <= i;
  });
  nodes = nodes.filter(function(it){
    return it.postorder <= i;
  });
  x$ = d3.select(this).selectAll('.mini-forest').data([tree]);
  x$.exit().remove();
  y$ = x$.enter().append('svg');
  y$.attr({
    'class': 'mini-forest',
    width: 60,
    height: 60
  });
  z$ = y$.append('g').attr('transform', "translate(5, 5)");
  z$.append('g').attr('class', 'links');
  z$.append('g').attr('class', 'nodes');
  z1$ = x$.select('.links').selectAll('.link').data(links);
  z1$.exit().remove();
  z1$.enter().append('path').attr('class', 'link');
  z1$.attr('d', diag);
  z2$ = x$.select('.nodes').selectAll('.node').data(nodes);
  z2$.exit().remove();
  z2$.enter().append('circle').attr('class', 'node');
  z2$.attr({
    cx: function(it){
      return it.x;
    },
    cy: function(it){
      return it.y;
    },
    r: 3
  });
  z2$.classed('highlight', function(it){
    return it.postorder === i;
  });
});
$s = bind$(document, 'querySelector');
parseAndDraw = function(input, error, svg){
  var ast, e;
  try {
    ast = parse(input.value || '');
    error.textContent = '';
    drawTree(ast, svg);
    return ast;
  } catch (e$) {
    e = e$;
    error.textContent = e;
  }
};
COST = {
  insertion: 2,
  deletion: 2,
  renaming: function(a, b){
    if (a.label === b.label) {
      return 0;
    } else {
      return 3;
    }
  }
};
diff = function(){
  var a, b, renamingFlat, cost, d, cols, x$, y$, z$, z1$, z2$, z3$, z4$, z5$, i$, ref$, len$, ref1$, i, j, diag, z6$, z7$, z8$, z9$;
  a = parseAndDraw($('input1'), $('error1'), d3.select('#tree1'));
  b = parseAndDraw($('input2'), $('error2'), d3.select('#tree2'));
  window.a = a;
  window.b = b;
  if (!(a != null && b != null)) {
    return;
  }
  renamingFlat = parseFloat($('renaming').value);
  cost = {
    insertion: parseFloat($('insertion').value),
    deletion: parseFloat($('deletion').value),
    renaming: function(a, b){
      if (a.label === b.label) {
        return 0;
      } else {
        return renamingFlat;
      }
    }
  };
  d = new EditDistance(a, b, cost);
  window.d = d;
  cols = [BLANK].concat(a.nodes);
  x$ = d3.select('#dtable');
  y$ = x$.select('thead > tr').selectAll('th').data([BLANK, BLANK].concat(b.nodes));
  y$.exit().remove();
  z$ = y$.enter().append('th');
  z$.append('span').attr('class', 'label');
  z$.append('sub').attr('class', 'postorder');
  z$.append('div').attr('class', 'forest');
  y$.select('.label').text(function(it){
    return it.label;
  });
  y$.select('.postorder').text(function(it){
    return it.postorder;
  });
  y$.select('.forest').each(miniForest(b));
  z1$ = x$.select('tbody').selectAll('tr').data(d.td);
  z1$.exit().remove();
  z2$ = z1$.enter().append('tr');
  z3$ = z2$.append('th');
  z3$.append('span').attr('class', 'label');
  z3$.append('sub').attr('class', 'postorder');
  z3$.append('span').attr('class', 'forest');
  z4$ = z1$.select('th');
  z4$.select('.label').text(function(arg$, i){
    return cols[i].label;
  });
  z4$.select('.postorder').text(function(arg$, i){
    return cols[i].postorder;
  });
  z4$.select('.forest').each(function(arg$, i){
    return miniForest.call(this, a, cols[i]);
  });
  z5$ = z1$.selectAll('td').data(function(it){
    return it;
  });
  z5$.exit().remove();
  z5$.enter().append('td');
  z5$.classed('trace', false);
  z5$.attr('id', function(arg$, j, i){
    return "td" + i + j;
  });
  z5$.text(d3.format('0.'));
  for (i$ = 0, len$ = (ref$ = d.trace).length; i$ < len$; ++i$) {
    ref1$ = ref$[i$], i = ref1$[0], j = ref1$[1];
    $("td" + i + j).classList.add('trace');
  }
  diag = function(it){
    var sx, sy, tx, ty;
    sx = it[0].x + 30;
    sy = it[0].y + 30;
    tx = it[1].x + 480;
    ty = it[1].y + 30;
    return "M " + sx + " " + sy + " A 500 500 0 0 0 " + tx + " " + ty;
  };
  z6$ = d3.select('#mappings');
  z7$ = z6$.selectAll('.mapping').data(d.mapping.filter(function(it){
    return it[0] != null && it[1] != null;
  }));
  z7$.exit().remove();
  z7$.enter().append('path');
  z7$.attr('class', function(it){
    return "mapping a" + it[0].postorder + " b" + it[1].postorder;
  });
  z7$.attr('d', diag);
  z8$ = d3.select('#tree1').selectAll('.node');
  z8$.classed('delete', function(it){
    return d.amap[it.postorder] == null;
  });
  z9$ = d3.select('#tree2').selectAll('.node');
  z9$.classed('insert', function(it){
    return d.bmap[it.postorder] == null;
  });
};
for (i$ = 0, len$ = (ref$ = ['input1', 'input2', 'insertion', 'deletion', 'renaming']).length; i$ < len$; ++i$) {
  el = ref$[i$];
  $(el).addEventListener('input', diff);
}
diff();
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}