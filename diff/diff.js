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

generateDiff("ABCABBA", "CBABAC");

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
