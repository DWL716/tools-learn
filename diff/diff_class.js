class PathNode {
  constructor(i, j, prev) {
    this.i = i;
    this.j = j;
    this.prev = prev;
  }

  isSnake() {
    return false;
  }

  toString() {
    let buf = "[";
    let node = this;
    while (node !== null) {
      buf += `(${node.i},${node.j})`;
      node = node.prev;
    }
    buf += "]";
    return buf;
  }
}

class Snake extends PathNode {
  constructor(i, j, prev) {
    super(i, j, prev);
  }

  isSnake() {
    return true;
  }
}

class DiffNode extends PathNode {
  constructor(i, j, prev) {
    super(i, j, prev);
  }

  isSnake() {
    return false;
  }
}

class MyersDiff {
  constructor() {}

  buildPath(orig, rev) {
    if (!orig) throw new Error("旧数据不能为空");
    if (!rev) throw new Error("新数据不能为空");
    const N = orig.length;
    const M = rev.length;
    const MAX = N + M + 1;
    const size = 1 + 2 * MAX;
    const middle = Math.floor(size / 2);
    const diagonal = new Array(size);
    diagonal[middle + 1] = new Snake(0, -1, null);

    for (let d = 0; d < MAX; d++) {
      for (let k = -d; k <= d; k += 2) {
        const kmiddle = middle + k;
        const kplus = kmiddle + 1;
        const kminus = kmiddle - 1;
        let i, prev;
        if (k === -d || (k !== d && diagonal[kminus].i < diagonal[kplus].i)) {
          i = diagonal[kplus].i;
          prev = diagonal[kplus];
        } else {
          i = diagonal[kminus].i + 1;
          prev = diagonal[kminus];
        }
        let j = i - k;
        diagonal[kminus] = null;
        let node = new DiffNode(i, j, prev);
        while (i < N && j < M && this.equals(orig[i], rev[j])) {
          i++;
          j++;
        }
        if (i > node.i) node = new Snake(i, j, node);
        diagonal[kmiddle] = node;
        if (i >= N && j >= M) return diagonal[kmiddle];
      }
    }
    throw new Error("could not find a diff path");
  }

  equals(orig, rev) {
    return orig === rev;
  }

  buildDiff(path, orig, rev) {
    if (!path) throw new Error("path is null");
    if (!orig) throw new Error("original sequence is null");
    if (!rev) throw new Error("revised sequence is null");
    const result = [];
    while (path && path.prev && path.prev.j >= 0) {
      if (path.isSnake()) {
        const endi = path.i;
        const begini = path.prev.i;
        for (let i = endi - 1; i >= begini; i--) {
          result.push(`  ${orig[i]}`);
        }
      } else {
        const i = path.i;
        const j = path.j;
        const prei = path.prev.i;
        if (prei < i) {
          result.push(`- ${orig[i - 1]}`);
        } else {
          result.push(`+ ${rev[j - 1]}`);
        }
      }
      path = path.prev;
    }
    result.reverse();
    for (const line of result) {
      console.log(line);
    }
  }
}

const oldStr = `
import React from 'react';

export default function () {
  return (
    <div>alibaba</div>
  )
}`;

const newStr = `
import React, { useState } from 'react';

const initName = 'alibaba'

export default function () {
  const [name, setName] = useState(initName);
  
  return (
    <div
      onClick={() => setName('hema')}
      title="name"
    >
      {name}
    </div>
  )
}

export {
  initName
}`;

const testCase = `-import React from 'react';
+import React, { useState } from 'react';
 
+const initName = 'alibaba'
+
 export default function () {
+  const [name, setName] = useState(initName);
+  
  return (
-   <div>alibaba</div>
+   <div
+     onClick={() => setName('hema')}
+     title="name"
+   >
+     {name}
+   </div>
   )
 }
+
+export {
+ initName
+}`;

let myersDiff = new MyersDiff();
let pathNode = myersDiff.buildPath(oldStr.split("\n"), newStr.split("\n"));
console.log(pathNode);

myersDiff.buildDiff(pathNode, oldStr.split("\n"), newStr.split("\n"));
