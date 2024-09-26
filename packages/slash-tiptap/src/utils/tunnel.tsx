import React, { type ReactNode } from "react";
import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

import useIsoMorphicEffect from "./use-isomorphic-effect";

type InletProps = {
  children: ReactNode;
};

const tunnel = () => {
  const tunnelStore = createStore(
    {
      currentChildren: [] as Array<ReactNode>,
    },
    {
      addChildren: (context, event: { value: ReactNode }) => {
        return {
          currentChildren: [...context.currentChildren, event.value],
        };
      },
      removeChildren: (context, event: { value: ReactNode }) => {
        return {
          currentChildren: context.currentChildren.filter(
            (child) => child !== event.value,
          ),
        };
      },
    },
  );

  return {
    Inlet: (props: InletProps) => {
      const { children } = props;

      useIsoMorphicEffect(() => {
        tunnelStore.send({ type: "addChildren", value: children });

        return () => {
          tunnelStore.send({ type: "removeChildren", value: children });
        };
      }, [props.children]);

      return null;
    },
    Outlet: () => {
      const children = useSelector(
        tunnelStore,
        (state) => state.context.currentChildren,
      );

      return <>{children}</>;
    },
  };
};

export default tunnel;
