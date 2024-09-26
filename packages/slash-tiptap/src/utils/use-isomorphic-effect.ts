import * as React from "react";

// A React helper hook for scheduling a layout effect with a
// fallback to a regular effect for environments where layout effects should not be use
const useIsoMorphicEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export default useIsoMorphicEffect;
