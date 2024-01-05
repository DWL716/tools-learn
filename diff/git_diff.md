### 请实现一个diff功能，根据oldStr和newStr，算出differ

```
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