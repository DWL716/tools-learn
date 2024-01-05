### 请实现一个diff功能，根据oldStr和newStr，算出differ

#### 参考资料
知乎 https://zhuanlan.zhihu.com/p/373921438

<!-- Git 是怎样生成 diff 的：Myers 算法 - CJ Ting's Blog -->
https://cjting.me/2017/05/13/how-git-generate-diff/

<!-- git 生成 diff 原理：Myers 差分算法 | 大艺术家_SN (chenshinan.github.io) -->
https://chenshinan.github.io/2019/05/02/git%E7%94%9F%E6%88%90diff%E5%8E%9F%E7%90%86%EF%BC%9AMyers%E5%B7%AE%E5%88%86%E7%AE%97%E6%B3%95/

<!-- Myers论文 -->
http://xmailserver.org/diff2.pdf

```js
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

function createDiff(oldStr, newStr) {
  // your code
}

console.log(createDiff(oldStr, newStr) === testCase)
// true

```