import tunnel from "../utils/tunnel";
import React from "react";

type TunnelInstace = ReturnType<typeof tunnel>;

const SlashCmdTunnelInstanceContext = React.createContext<TunnelInstace | null>(
  null,
);

export default SlashCmdTunnelInstanceContext;
