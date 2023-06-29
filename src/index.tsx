import Controls, { ControlProps, Events } from "overdrag";
import React, { useEffect, useRef, useState } from "react";

type EventNames = (typeof Events)[keyof typeof Events];
type EventNamesOn = `on${Capitalize<Extract<EventNames, string>>}`;
//keyof typeof Events
type MyInterfaceProps = {
  [key in EventNamesOn]?: (instance: Controls) => void;
};
type UseOverdragProps = Omit<ControlProps, "element"> & MyInterfaceProps;

function useOverdrag({
  minContentHeight,
  minContentWidth,
  snapThreshold,
  controlsThreshold,
  clickDetectionThreshold,
  stack,
  ...props
}: UseOverdragProps) {
  const [overdrag, setOverdrag] = useState<Controls>();
  const ref = useRef<HTMLDivElement>(null);

  // initialize overdrag only when ref is available and constructor params are changed
  useEffect(() => {
    if (ref.current) {
      setOverdrag(
        new Controls({
          element: ref.current,
          ...{
            minContentHeight,
            minContentWidth,
            snapThreshold,
            controlsThreshold,
            clickDetectionThreshold,
            stack,
          },
        })
      );
    }
  }, [
    minContentHeight,
    minContentWidth,
    snapThreshold,
    stack,
    controlsThreshold,
    clickDetectionThreshold,
  ]);

  useEffect(() => {
    if (overdrag) {
      // find events in props and assign them to overdrag
      for (const event in props) {
        // just like in type definition above, we only care about events that start with "on"
        if (event.startsWith("on")) {
          // first char to lowercase and remove "on"
          const eventName =
            event.slice(2).charAt(0).toLowerCase() + event.slice(3);
          // get the handler function from props
          const fn = props[event as keyof MyInterfaceProps] as () => void;
          // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
          const current = overdrag?._events[eventName]?.fn;
          // remove old event listener
          if (current && fn !== current) {
            // we are doing this to ensure that we don't add the same event listener twice and update the handler function due to React architecture
            overdrag.off(eventName as EventNames, current);
          }
          // add event listeners
          overdrag.on(eventName as EventNames, fn);
        }
      }
    }
    return () => {
      if (overdrag) {
        // remove all event listeners
        overdrag.removeAllListeners();
      }
    };
  }, [overdrag, props]);

  return [ref] as const;
}

export type OverdragProps = UseOverdragProps &
  Omit<React.HTMLAttributes<HTMLAllCollection>, EventNamesOn>;

/**
 * Overdrag React Component
 */
export default function Overdrag(props: OverdragProps): JSX.Element {
  const [ref] = useOverdrag(props);
  return (
    <div ref={ref} style={props.style}>
      {props.children}
    </div>
  );
}
