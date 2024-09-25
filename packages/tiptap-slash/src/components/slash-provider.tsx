import React from "react";
import tunnel from "../utils/tunnel";
import SlashCmdTunnelInstanceContext from "./tunnel-instance";

type SlashCmdProviderProps = {
  children: React.ReactNode;
};

/**
 * We need to wrap our entire editor in this provider, so that tippy can use our tunneled instance to communicate with the editor.
 */

const SlashCmdProvider = (props: SlashCmdProviderProps) => {
  const tunnelInstance = React.useRef(tunnel()).current;

  return (
    <SlashCmdTunnelInstanceContext.Provider value={tunnelInstance}>
      {props.children}
    </SlashCmdTunnelInstanceContext.Provider>
  );
};

export default SlashCmdProvider;
