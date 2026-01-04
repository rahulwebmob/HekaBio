/// <reference types="vite/client" />

// SVG imports
declare module '*.svg?react' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
