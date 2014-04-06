// Generated by LiveScript 1.2.0
var children, childrenOf, postorder, Tree, D, R, I, HEAP_SIZE, HEAP, nextSize, prgm, EditDistance, COST, L, supertypeOf, genHtml, $, $q, $$, input1, error1, output1, input2, error2, output2, hovered, calcDiff, parse, parse1, parse2, out$ = typeof exports != 'undefined' && exports || this;
children = {
  AssignmentExpression: function(it){
    return [it.left, it.right];
  },
  ArrayExpression: function(it){
    return it.elements;
  },
  BlockStatement: function(it){
    return it.body;
  },
  BinaryExpression: function(it){
    return [it.left, it.right];
  },
  BreakStatement: function(it){
    return [it.identitifier];
  },
  CallExpression: function(it){
    return [it.callee].concat(it.arguments);
  },
  CatchClause: function(it){
    return [it.param, it.guard, it.body];
  },
  ConditionalExpression: function(it){
    return [it.test, it.alternate, it.consequent];
  },
  ContinueStatement: function(it){
    return [it.identifier];
  },
  DoWhileStatement: function(it){
    return [it.body, it.test];
  },
  DebuggerStatement: function(){
    return [];
  },
  EmptyStatement: function(){
    return [];
  },
  ExpressionStatement: function(it){
    return [it.expression];
  },
  ForStatement: function(it){
    return [it.init, it.test, it.update, it.body];
  },
  ForInStatement: function(it){
    return [it.left, it.right, it.body];
  },
  FunctionDeclaration: function(it){
    return [it.id].concat(it.params, [it.body]);
  },
  FunctionExpression: function(it){
    return [it.id].concat(it.params, [it.body]);
  },
  Identifier: function(){
    return [];
  },
  IfStatement: function(it){
    return [it.test, it.consequent, it.alternate];
  },
  Literal: function(){
    return [];
  },
  LabeledStatement: function(it){
    return [it.body];
  },
  LogicalExpression: function(it){
    return [it.left, it.right];
  },
  MemberExpression: function(it){
    return [it.object, it.property];
  },
  NewExpression: function(it){
    return [it.callee].concat(it.arguments);
  },
  ObjectExpression: function(it){
    return it.properties;
  },
  Program: function(it){
    return it.body;
  },
  Property: function(it){
    return [it.key, it.value];
  },
  ReturnStatement: function(it){
    return [it.argument];
  },
  SequenceExpression: function(it){
    return it.expressions;
  },
  SwitchStatement: function(it){
    return [it.discriminant].concat(it.cases);
  },
  SwitchCase: function(it){
    return [it.test].concat(it.consequent);
  },
  ThisExpression: function(){
    return [];
  },
  ThrowStatement: function(it){
    return [it.argument];
  },
  TryStatement: function(it){
    return [it.block, it.handler, it.finalizer];
  },
  UnaryExpression: function(it){
    return [it.argument];
  },
  UpdateExpression: function(it){
    return [it.argument];
  },
  VariableDeclaration: function(it){
    return it.declarations;
  },
  VariableDeclarator: function(it){
    return [it.id, it.init];
  },
  WhileStatement: function(it){
    return [it.test, it.body];
  },
  WithStatement: function(it){
    return [it.expression, it.body];
  }
};
childrenOf = function(it){
  return children[it.type](it).filter(function(it){
    return it != null;
  });
};
postorder = function(root){
  var n, stack, frame, ref$, node, children, child;
  n = 0;
  stack = [[root, childrenOf(root)]];
  while (stack.length > 0) {
    ref$ = frame = stack.pop(), node = ref$[0], children = ref$[1];
    if (children.length > 0) {
      child = children.shift();
      stack.push(frame, [child, childrenOf(child)]);
    } else {
      node.postorder = n++;
    }
  }
};
Tree = (function(){
  Tree.displayName = 'Tree';
  var prototype = Tree.prototype, constructor = Tree;
  function Tree(root){
    var x$, i$, y$, ref$, len$, n, stack, frame, node, children, child, z$;
    x$ = this.root = root;
    x$.keyRoot = true;
    this.nodes = [];
    this.keyRoots = [root];
    for (i$ = 0, len$ = (ref$ = childrenOf(root).slice(1).reverse()).length; i$ < len$; ++i$) {
      y$ = ref$[i$];
      y$.keyRoot = true;
      this.keyRoots.unshift(y$);
    }
    n = 0;
    stack = [[root, childrenOf(root).slice()]];
    while (stack.length > 0) {
      ref$ = frame = stack.pop(), node = ref$[0], children = ref$[1];
      if (children.length > 0) {
        child = children.shift();
        for (i$ = 0, len$ = (ref$ = childrenOf(child).slice(1).reverse()).length; i$ < len$; ++i$) {
          z$ = ref$[i$];
          z$.keyRoot = true;
          this.keyRoots.unshift(z$);
        }
        stack.push(frame, [child, childrenOf(child)]);
      } else {
        this.nodes.push(node);
        node.postorder = n++;
        node.leftmost = childrenOf(node).length > 0 ? childrenOf(node)[0].leftmost : node;
      }
    }
    this.size = n;
  }
  return Tree;
}());
D = 0;
R = 1;
I = 2;
HEAP_SIZE = 33554432;
HEAP = new ArrayBuffer(HEAP_SIZE);
nextSize = function(it){
  var size;
  size = 4096;
  while (!(size >= 4 * it)) {
    size *= 2;
  }
  return size;
};
prgm = ZhangShasha(window, {}, HEAP).diff;
EditDistance = (function(){
  EditDistance.displayName = 'EditDistance';
  var prototype = EditDistance.prototype, constructor = EditDistance;
  function EditDistance(a, b, cost){
    var deletion, insertion, renaming, asize, bsize, as, bs, total, tdSize, fdSize, btSize, renamesSize, aStructSize, bStructSize, kraArrSize, krbArrSize, ofs, alloc, td, fd, bt, renames, i$, ref$, len$, i, aa, j$, ref1$, len1$, j, bb, astruct, bstruct, kra, kr1, krb, kr2, k;
    deletion = cost.deletion, insertion = cost.insertion, renaming = cost.renaming;
    asize = a.size;
    bsize = b.size;
    as = asize + 1;
    bs = bsize + 1;
    total = nextSize((tdSize = as * bs) + (fdSize = as * bs) + (btSize = as * bs) + (renamesSize = asize * bsize) + (aStructSize = 4 * a.size) + (bStructSize = 4 * b.size) + (kraArrSize = a.keyRoots.length) + (krbArrSize = b.keyRoots.length));
    if (total > HEAP_SIZE) {
      alert('not enough heap space :(');
    }
    ofs = 0;
    alloc = function(size){
      var ptr;
      ptr = ofs;
      ofs += size;
      return new Uint32Array(HEAP, ptr * 4, size);
    };
    td = alloc(tdSize);
    this.td = td;
    fd = alloc(fdSize);
    bt = alloc(fdSize);
    renames = alloc(renamesSize);
    for (i$ = 0, len$ = (ref$ = a.nodes).length; i$ < len$; ++i$) {
      i = i$;
      aa = ref$[i$];
      for (j$ = 0, len1$ = (ref1$ = b.nodes).length; j$ < len1$; ++j$) {
        j = j$;
        bb = ref1$[j$];
        renames[i * bsize + j] = renaming(aa, bb);
      }
    }
    astruct = alloc(aStructSize);
    for (i$ = 0, len$ = (ref$ = a.nodes).length; i$ < len$; ++i$) {
      i = i$;
      aa = ref$[i$];
      astruct[i * 3] = aa.postorder;
      astruct[i * 3 + 1] = aa.leftmost.postorder;
      astruct[i * 3 + 2] = aa.leftmost.leftmost.postorder;
    }
    bstruct = alloc(bStructSize);
    for (i$ = 0, len$ = (ref$ = b.nodes).length; i$ < len$; ++i$) {
      i = i$;
      bb = ref$[i$];
      bstruct[i * 3] = bb.postorder;
      bstruct[i * 3 + 1] = bb.leftmost.postorder;
      bstruct[i * 3 + 2] = bb.leftmost.leftmost.postorder;
    }
    kra = alloc(kraArrSize);
    for (i$ = 0, len$ = (ref$ = a.keyRoots).length; i$ < len$; ++i$) {
      i = i$;
      kr1 = ref$[i$];
      kra[i] = kr1.postorder;
    }
    krb = alloc(krbArrSize);
    for (i$ = 0, len$ = (ref$ = b.keyRoots).length; i$ < len$; ++i$) {
      i = i$;
      kr2 = ref$[i$];
      krb[i] = kr2.postorder;
    }
    console.time('main');
    prgm(astruct.byteOffset, asize, kra.byteOffset, kraArrSize, bstruct.byteOffset, bsize, krb.byteOffset, krbArrSize, td.byteOffset, fd.byteOffset, bt.byteOffset, renames.byteOffset, insertion, deletion);
    console.timeEnd('main');
    this.distance = td[asize * bs + bsize];
    this.mapping = [];
    this.amap = {};
    this.bmap = {};
    this.trace = [];
    i = a.size;
    j = b.size;
    k = a.size * b.size;
    while (i >= 0 && j >= 0 && k > 0) {
      --k;
      this.trace.push([i, j]);
      switch (bt[i * bs + j]) {
      case R:
        if (i > 0 && j > 0) {
          this.mapping.push([a.nodes[i - 1], b.nodes[j - 1]]);
          this.amap[i - 1] = j - 1;
          this.bmap[j - 1] = i - 1;
        }
        --i;
        --j;
        break;
      case I:
        if (j > 0) {
          this.mapping.push([null, b.nodes[j - 1]]);
          this.bmap[j - 1] = null;
        }
        --j;
        break;
      case D:
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
out$.COST = COST = {
  insertion: 1,
  deletion: 1,
  renaming: function(left, right){
    if (left.type === right.type) {
      if (left.type === 'Literal') {
        if (left.raw === right.raw) {
          return 0;
        } else {
          return 10;
        }
      } else if (left.type === 'Identifier') {
        if (left.name === right.name) {
          return 0;
        } else {
          return 10;
        }
      } else {
        return 0;
      }
    } else {
      return 10;
    }
  }
};
L = bind$(document, 'createElement');
supertypeOf = function(it){
  if (/Statement/.test(it.type)) {
    return 'Statement';
  } else if (/Declaration/.test(it.type)) {
    return 'Statement';
  } else if (/Expression/.test(it.type)) {
    return 'Expression';
  } else {
    return '';
  }
};
genHtml = function(source, ast){
  var starts, ends, q, node, ref$, start, end, key$, el, frag, text, depth, typeStack, i$, len$, i, c, that, j$, len1$, elem, x$, curType;
  starts = {};
  ends = {};
  q = [ast];
  while ((node = q.pop()) != null) {
    ref$ = node.range, start = ref$[0], end = ref$[1];
    (starts[start] || (starts[start] = [])).push(node);
    (ends[key$ = end - 1] || (ends[key$] = [])).unshift(node);
    q.push.apply(q, childrenOf(node));
  }
  el = frag = document.createDocumentFragment();
  text = '';
  depth = 0;
  typeStack = [];
  for (i$ = 0, len$ = source.length; i$ < len$; ++i$) {
    i = i$;
    c = source[i$];
    if ((that = starts[i]) != null) {
      el.appendChild(document.createTextNode(text));
      text = '';
      for (j$ = 0, len1$ = that.length; j$ < len1$; ++j$) {
        node = that[j$];
        elem = (x$ = L('span'), x$.className = "syntax " + node.type + " " + supertypeOf(node), x$.dataset.postorder = node.postorder, x$);
        typeStack.push(node.type);
        curType = node.type;
        depth++;
        el.appendChild(elem);
        el = elem;
      }
    }
    if (curType === 'BlockStatement') {
      if (!(c === '{' || c === '}')) {
        text += c;
      }
    } else {
      if (c !== '\n') {
        text += c;
      }
    }
    if ((that = ends[i]) != null) {
      el.appendChild(document.createTextNode(text));
      text = '';
      for (j$ = 0, len1$ = that.length; j$ < len1$; ++j$) {
        node = that[j$];
        el = el.parentNode;
        typeStack.pop();
        curType = typeStack[typeStack.length - 1];
        depth--;
      }
    }
  }
  return frag;
};
$ = bind$(document, 'getElementById');
$q = bind$(document, 'querySelector');
$$ = bind$(document, 'querySelectorAll');
input1 = $('input1');
error1 = $('error1');
output1 = $('output1');
input2 = $('input2');
error2 = $('error2');
output2 = $('output2');
hovered = [];
calcDiff = function(){
  var ast1, ast2, e, f1, f2, d, i$, ref$, len$, node, postorder, that;
  try {
    ast1 = esprima.parse(input1.value);
    ast2 = esprima.parse(input2.value);
  } catch (e$) {
    e = e$;
    return;
  }
  console.time('ast1');
  f1 = new Tree(ast1);
  console.timeEnd('ast1');
  console.time('ast2');
  f2 = new Tree(ast2);
  console.timeEnd('ast2');
  console.time('dist');
  d = new EditDistance(f1, f2, COST);
  console.timeEnd('dist');
  console.log(d);
  for (i$ = 0, len$ = (ref$ = $$('#output1 .syntax')).length; i$ < len$; ++i$) {
    node = ref$[i$];
    postorder = node.getAttribute('data-postorder');
    if ((that = d.amap[postorder]) != null) {
      (fn$.call(this, that, postorder, node));
    } else {
      node.classList.add('deleted');
    }
  }
  for (i$ = 0, len$ = (ref$ = $$('#output2 .syntax')).length; i$ < len$; ++i$) {
    node = ref$[i$];
    postorder = node.getAttribute('data-postorder');
    if ((that = d.bmap[postorder]) != null) {
      (fn1$.call(this, that, postorder, node));
    } else {
      node.classList.add('added');
    }
  }
  function fn$(mapped, postorder, node){
    node.classList.add('mapped');
    node.addEventListener('mouseenter', function(){
      var i$, x$, ref$, len$;
      for (i$ = 0, len$ = (ref$ = $$(".hover")).length; i$ < len$; ++i$) {
        x$ = ref$[i$];
        x$.classList.remove('hover');
      }
      this.classList.add('hover');
      hovered.push([mapped, postorder]);
      $q("#output2 [data-postorder=\"" + mapped + "\"]").classList.add('hover');
    }, false);
    node.addEventListener('mouseleave', function(){
      var i$, x$, ref$, len$, that;
      for (i$ = 0, len$ = (ref$ = $$(".hover")).length; i$ < len$; ++i$) {
        x$ = ref$[i$];
        x$.classList.remove('hover');
      }
      hovered.pop();
      if ((that = hovered[hovered.length - 1]) != null) {
        $q("#output2 [data-postorder=\"" + that[0] + "\"]").classList.add('hover');
        $q("#output1 [data-postorder=\"" + that[1] + "\"]").classList.add('hover');
      }
    }, false);
  }
  function fn1$(mapped, postorder, node){
    node.classList.add('mapped');
    node.addEventListener('mouseenter', function(){
      var i$, x$, ref$, len$;
      for (i$ = 0, len$ = (ref$ = $$(".hover")).length; i$ < len$; ++i$) {
        x$ = ref$[i$];
        x$.classList.remove('hover');
      }
      this.classList.add('hover');
      hovered.push([mapped, postorder]);
      $q("#output1 [data-postorder=\"" + mapped + "\"]").classList.add('hover');
    }, false);
    node.addEventListener('mouseleave', function(){
      var i$, x$, ref$, len$, that;
      for (i$ = 0, len$ = (ref$ = $$(".hover")).length; i$ < len$; ++i$) {
        x$ = ref$[i$];
        x$.classList.remove('hover');
      }
      hovered.pop();
      if ((that = hovered[hovered.length - 1]) != null) {
        $q("#output1 [data-postorder=\"" + that[0] + "\"]").classList.add('hover');
        $q("#output2 [data-postorder=\"" + that[1] + "\"]").classList.add('hover');
      }
    }, false);
  }
};
parse = function(input, error, output){
  return function(){
    var ast, e, that, normalizedCode, normalizedAst;
    try {
      ast = esprima.parse(input.value, {
        range: true
      });
    } catch (e$) {
      e = e$;
      error.textContent = e;
      input.classList.add('error');
      return;
    }
    postorder(ast);
    while ((that = output.firstChild) != null) {
      output.removeChild(that);
    }
    normalizedCode = escodegen.generate(ast, {
      format: {
        indent: {
          style: ''
        },
        semicolons: false
      }
    });
    normalizedAst = esprima.parse(normalizedCode, {
      range: true
    });
    postorder(normalizedAst);
    output.appendChild(genHtml(normalizedCode, normalizedAst));
    input.classList.remove('error');
    error.textContent = '';
  };
};
parse1 = parse(input1, error1, output1);
parse2 = parse(input2, error2, output2);
$('input1').addEventListener('input', parse1);
$('input2').addEventListener('input', parse2);
parse1();
parse2();
$('calc').addEventListener('click', calcDiff);
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}