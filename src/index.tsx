import Controls, { ControlProps, Events } from "overdrag";
import React, { useEffect, useMemo, useRef, useState } from "react";

type EventNames = (typeof Events)[keyof typeof Events];
type EventNamesOn = `on${Capitalize<Extract<EventNames, string>>}`;
//Enable all events with instance as parameter for intellisense
type MyInterfaceProps = {
  [key in EventNamesOn]?: (instance: Controls) => void;
};
type UseOverdragProps = Omit<ControlProps, "element"> & MyInterfaceProps;

function useOverdrag({
  args,
  events,
}: {
  args: Omit<ControlProps, "element">;
  events: MyInterfaceProps;
}) {
  const [overdrag, setOverdrag] = useState<Controls>();
  const ref = useRef<HTMLDivElement>(null);

  // initialize overdrag only when ref is available and constructor params are changed
  useEffect(() => {
    if (ref.current) {
      setOverdrag(
        new Controls({
          element: ref.current,
          ...args,
        })
      );
    }
  }, [args]);

  useEffect(() => {
    if (overdrag) {
      // find events in props and assign them to overdrag
      for (const event in events) {
        // first char to lowercase and remove "on"
        const eventName =
          event.slice(2).charAt(0).toLowerCase() + event.slice(3);
        // get the handler function from events
        const fn = events[event as keyof MyInterfaceProps] as () => void;
        // @ts-expect-error - we are sure that this is not undefined
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
    return () => {
      if (overdrag) {
        // remove all event listeners
        overdrag.removeAllListeners();
      }
    };
  }, [overdrag, events]);

  return [ref] as const;
}

export type OverdragProps = UseOverdragProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, EventNamesOn>;

/**
 * Overdrag React Component
 */
export default function Overdrag({
  onDown,
  onUp,
  onClick,
  onDrag,
  onDragStart,
  onDragEnd,
  onOver,
  onOut,
  onControlsActive,
  onControlsInactive,
  onControlRightUpdate,
  onControlLeftUpdate,
  onControlTopUpdate,
  onControlBottomUpdate,
  onResize,
  onResizeStart,
  onResizeEnd,
  onUpdate,
  minContentHeight,
  minContentWidth,
  maxContentHeight,
  maxContentWidth,
  snapThreshold,
  controlsThreshold,
  clickDetectionThreshold,
  stack,
  excludePadding,
  children,
  ...props
}: OverdragProps): JSX.Element {
  // remove undefined handlers and memoize it to prevent unnecessary re-renders
  const events = useMemo(() => {
    const events = {
      onDown,
      onUp,
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onOver,
      onOut,
      onControlsActive,
      onControlsInactive,
      onControlRightUpdate,
      onControlLeftUpdate,
      onControlTopUpdate,
      onControlBottomUpdate,
      onResize,
      onResizeStart,
      onResizeEnd,
      onUpdate,
    };

    for (const key in events) {
      if (!events[key as keyof typeof events]) {
        delete events[key as keyof typeof events];
      }
    }

    return events;
  }, [
    onClick,
    onControlBottomUpdate,
    onControlLeftUpdate,
    onControlRightUpdate,
    onControlTopUpdate,
    onControlsActive,
    onControlsInactive,
    onDown,
    onDrag,
    onDragEnd,
    onDragStart,
    onOut,
    onOver,
    onResize,
    onResizeEnd,
    onResizeStart,
    onUp,
    onUpdate,
  ]);

  // remove undefined args and memoize it to prevent unnecessary re-renders
  const args = useMemo(() => {
    const args = {
      minContentHeight,
      minContentWidth,
      maxContentHeight,
      maxContentWidth,
      snapThreshold,
      controlsThreshold,
      clickDetectionThreshold,
      stack,
      excludePadding,
    };

    for (const key in args) {
      if (!args[key as keyof typeof args]) {
        delete args[key as keyof typeof args];
      }
    }

    return args;
  }, [
    clickDetectionThreshold,
    controlsThreshold,
    excludePadding,
    maxContentHeight,
    maxContentWidth,
    minContentHeight,
    minContentWidth,
    snapThreshold,
    stack,
  ]);
  const [ref] = useOverdrag({
    events,
    args,
  });
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
