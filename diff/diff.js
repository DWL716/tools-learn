// js 实现 Myers 算法

const operation = {
  INSERT: 1,
  DELETE: 2,
  MOVE: 3,
};

const colors = {
  [operation.INSERT]: "\x1b[32m",
  [operation.DELETE]: "\x1b[31m",
  [operation.MOVE]: "\x1b[39m",
};

function generateDiff(src, dst) {
  const script = shortestEditScript(src, dst);
  let srcIndex = 0;
  let dstIndex = 0;

  for (const op of script) {
    switch (op) {
      case operation.INSERT:
        console.log(colors[op] + "+" + dst[dstIndex]);
        dstIndex++;
        break;
      case operation.MOVE:
        console.log(colors[op] + " " + src[srcIndex]);
        srcIndex++;
        dstIndex++;
        break;
      case operation.DELETE:
        console.log(colors[op] + "-" + src[srcIndex]);
        srcIndex++;
        break;
    }
  }
}

function shortestEditScript(src, dst) {
  console.log(src, dst);
  const n = src.length;
  const m = dst.length;
  const max = n + m;
  const trace = [];
  let x, y;

  loop: for (let d = 0; d <= max; d++) {
    const v = new Map();
    trace.push(v);

    if (d === 0) {
      let t = 0;
      while (src[t] && dst[t] && src[t] === dst[t]) {
        t++;
      }
      v.set(0, t);
      if (t === n && t === m) {
        break loop;
      }
      continue;
    }

    const lastV = trace[d - 1];

    for (let k = -d; k <= d; k += 2) {
      if (k === -d || (k !== d && lastV.get(k - 1) < lastV.get(k + 1))) {
        x = lastV.get(k + 1);
      } else {
        x = lastV.get(k - 1) + 1;
      }

      y = x - k;

      while (src[x] && dst[y] && src[x] === dst[y]) {
        x++;
        y++;
      }

      v.set(k, x);

      if (x === n && y === m) {
        break loop;
      }
    }
  }

  const script = [];
  x = n;
  y = m;
  let k, prevK, prevX, prevY;

  for (let d = trace.length - 1; d > 0; d--) {
    k = x - y;
    const lastV = trace[d - 1];

    if (k === -d || (k !== d && lastV.get(k - 1) < lastV.get(k + 1))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    prevX = lastV.get(prevK);
    prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      script.push(operation.MOVE);
      x--;
      y--;
    }

    if (x === prevX) {
      script.push(operation.INSERT);
    } else {
      script.push(operation.DELETE);
    }

    x = prevX;
    y = prevY;
  }

  if (trace[0].get(0) !== 0) {
    for (let i = 0; i < trace[0].get(0); i++) {
      script.push(operation.MOVE);
    }
  }

  return script.reverse();
}

// generateDiff("A AABCABBA".split(""), "A CBABAC".split(""));
generateDiff("A BCDEF".split(""), "H I BJ CKLMNOPEF QLI ".split(""));

/**
-A
-B
 C
+B
 A
 B
-B
 A
+C
 */

/**
 * 请实现一个diff功能，根据oldStr和newStr，算出differ
 **/

const oldStr = `
import React from 'react';

export default function () {
  return (
    <div>alibaba</div>
  )
}
`;

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
}
`;

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

// generateDiff(oldStr.split("\n"), newStr.split("\n"));
generateDiff(
  [
    "import React from 'react';",
    "",
    "export default function () {",
    "  return (",
    "    <div>alibaba</div>",
    "  )",
    "}",
    "",
  ],
  [
    "import React, { useState } from 'react';",
    "",
    "const initName = 'alibaba'",
    "",
    "export default function () {",
    "  const [name, setName] = useState(initName);",
    "  ",
    "  return (",
    "    <div",
    "      onClick={() => setName('hema')}",
    '      title="name"',
    "    >",
    "      {name}",
    "    </div>",
    "  )",
    "}",
    "",
    "export {",
    "  initName",
    "}",
    "",
  ]
);

/********************/

// 动态规划函数，用于找出两个字符串之间的最长公共子序列
function findTextDiff(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 根据最长公共子序列找出差异
  let diff = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      diff.unshift(`  ${text1[i - 1]}`);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      diff.unshift(`- ${text1[i - 1]}`);
      i--;
    } else {
      diff.unshift(`+ ${text2[j - 1]}`);
      j--;
    }
  }

  while (i > 0) {
    diff.unshift(`- ${text1[i - 1]}`);
    i--;
  }

  while (j > 0) {
    diff.unshift(`+ ${text2[j - 1]}`);
    j--;
  }

  return diff;
}
/**
 * A B C B D A B
 * B
 * C
 * B
 * D
 * A
 * B
 */

// 示例文本
const text1 = "ABCBDAB";
const text2 = "BDCAB";

// 找出文本差异
const textDiff = findTextDiff(text1, text2);
textDiff.forEach((line) => console.log(line));
