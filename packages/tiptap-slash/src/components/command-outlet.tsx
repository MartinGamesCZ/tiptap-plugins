import slashStore from "../utils/store";
import React from "react";
import { SLASH_EXTENSION_DOM_ID, navigationKeys } from "../utils/constants";
import SlashCmdTunnelInstanceContext from "./tunnel-instance";
import type { TipTapRange } from "../types";

interface SlashCommandOutProps {
  readonly query: string;
  readonly range: TipTapRange;
}

const CommandTunnelOutlet = (props: SlashCommandOutProps) => {
  React.useEffect(() => {
    slashStore.send({
      type: "setQuery",
      query: props.query,
    });
  }, [props.query]);

  React.useEffect(() => {
    slashStore.send({
      type: "setRange",
      range: props.range,
    });
  }, [props.range]);

  React.useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      "keydown",
      (event) => {
        if (navigationKeys.includes(event.key)) {
          // prevent default behavior of the key
          event.preventDefault();

          const slashCommandRef = document.getElementById(
            SLASH_EXTENSION_DOM_ID,
          );

          if (slashCommandRef) {
            // dispatch the keydown event to the slash command
            slashCommandRef.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: event.key,
                cancelable: true,
                bubbles: true,
              }),
            );

            return false;
          }
        }
      },
      {
        signal: abortController.signal,
      },
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <SlashCmdTunnelInstanceContext.Consumer>
      {(tunnelInstance) => {
        if (!tunnelInstance) {
          throw new Error(
            "Command component must be used within a <SlashProvider/>. Make sure your instance of editor and command are wrapped in the provider",
          );
        }

        return <tunnelInstance.Outlet />;
      }}
    </SlashCmdTunnelInstanceContext.Consumer>
  );
};

export default CommandTunnelOutlet;
