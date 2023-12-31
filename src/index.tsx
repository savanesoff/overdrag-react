import Controls, { ControlProps, Events } from "overdrag";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EventNames = (typeof Events)[keyof typeof Events];
// Collect events belonging to Controls so we can filter them out for HTML props
type EventNamesOn = `on${Capitalize<Extract<EventNames, string>>}`;
//Enable all events with instance as parameter for intellisense
type MyInterfaceProps = {
  [key in EventNamesOn]?: (instance: Controls) => void;
};

export type OverdragProps = Omit<ControlProps, "element"> &
  MyInterfaceProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, EventNamesOn>;

/**
 * Overdrag React Component
 * A div element with overdrag functionality
 * Use it as you would use a div element with any other props
 */
export default function Overdrag({
  // Overdrag events
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
  // Overdrag props
  minContentHeight,
  minContentWidth,
  maxContentHeight,
  maxContentWidth,
  snapThreshold,
  controlsThreshold,
  clickDetectionThreshold,
  stack,
  excludePadding,
  // React props
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

  const ref = useRef<HTMLDivElement>(null);

  const [overdrag, setOverdrag] = useState<Controls>();

  const setEvents = useCallback(
    (controls: Controls) => {
      // find events in props and assign them to overdrag
      for (const event in events) {
        // first char to lowercase and remove "on"
        const eventName =
          event.slice(2).charAt(0).toLowerCase() + event.slice(3);
        // get the handler function from events
        const fn = events[event as keyof MyInterfaceProps] as () => void;
        // @ts-expect-error - we are sure that this is not undefined
        const current = controls?._events[eventName]?.fn;
        // remove old event listener
        if (current && fn !== current) {
          // we are doing this to ensure that we don't add the same event listener twice and update the handler function due to React architecture
          controls.off(eventName as EventNames, current);
        }
        // add event listeners
        controls.on(eventName as EventNames, fn);
      }
    },
    [events]
  );

  // initialize overdrag only when ref is available and constructor params are changed
  useEffect(() => {
    // if overdrag is already initialized or ref is not available or overdrag is already initialized
    if (overdrag || !ref.current || ref.current.__overdrag) {
      return;
    }
    const controls = new Controls({
      element: ref.current,
      ...args,
    });
    setEvents(controls);
    setOverdrag(controls);
  }, [args, overdrag, setEvents]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
