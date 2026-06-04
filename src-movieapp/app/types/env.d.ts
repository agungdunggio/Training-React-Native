declare module '@env' {
  export const TMDB_ACCESS_TOKEN: string;
  export const TMDB_BASE_URL: string;
}

declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

