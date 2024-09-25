import { useSelector } from "@xstate/store/react";
import { Command as Cmd } from "cmdk";
import React, { type ComponentPropsWithRef } from "react";
import slashStore from "../utils/store";
import SlashCmdTunnelInstanceContext from "./tunnel-instance";
import { SLASH_EXTENSION_DOM_ID } from "../utils/constants";

const Command = React.forwardRef<
  React.ElementRef<"div">,
  Omit<ComponentPropsWithRef<typeof Cmd>, "id" | "onKeyDown">
>((props, ref) => {
  const { children, className, ...restProps } = props;
  const { query } = useSelector(slashStore, (state) => state.context);

  const onChange = (query: string) => {
    slashStore.send({
      type: "setQuery",
      query: query,
    });
  };

  return (
    <SlashCmdTunnelInstanceContext.Consumer>
      {(tunnel) => {
        if (!tunnel) {
          throw new Error(
            "Command component must be used within a <SlashProvider/>. Make sure your instance of editor and command are wrapped in the provider",
          );
        }

        return (
          <tunnel.Inlet>
            <Cmd
              {...restProps}
              ref={ref}
              onKeyDown={(e) => e.stopPropagation()}
              className={className}
              id={SLASH_EXTENSION_DOM_ID}
            >
              <Cmd.Input
                value={query}
                onValueChange={onChange}
                style={{ display: "none" }}
              />
              {children}
            </Cmd>
          </tunnel.Inlet>
        );
      }}
    </SlashCmdTunnelInstanceContext.Consumer>
  );
});

Command.displayName = "SlashCommand";

export default Command;
