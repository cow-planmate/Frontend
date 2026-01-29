import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Resizable } from "react-resizable";
import { CSS } from "@dnd-kit/utilities";
import ResizeHandle from "./ResizeHandle";
import useTimetableStore from "../../../store/Timetables";
import { formatTime } from "../../../utils/createUtils";

export const ResizableScheduledItem = ({ item, onResizeEnd }) => {
  const { SLOT_HEIGHT, TOTAL_SLOTS } = useTimetableStore();
  const [isResizing, setIsResizing] = useState(false);
  const place = item?.place;

  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: item.id,
      data: { type: "schedule", ...item },
      disabled: isResizing,
    });

  const [localState, setLocalState] = useState({
    height: item.duration * SLOT_HEIGHT,
    top: 20 + item.start * SLOT_HEIGHT,
  });

  useEffect(() => {
    if (!isResizing) {
      setLocalState({
        height: item.duration * SLOT_HEIGHT,
        top: 20 + item.start * SLOT_HEIGHT,
      });
    }
  }, [item.duration, item.start, isResizing, SLOT_HEIGHT]);

  const onResizeStart = () => setIsResizing(true);

  const onResize = (e, { size, handle }) => {
    if (handle === "n") {
      const heightDelta = size.height - localState.height;
      setLocalState({
        height: size.height,
        top: localState.top - heightDelta,
      });
    } else {
      setLocalState((prev) => ({ ...prev, height: size.height }));
    }
  };

  const onResizeStop = (e, { size, handle }) => {
    setIsResizing(false);
    const slotsChanged = Math.round(
      (size.height - item.duration * SLOT_HEIGHT) / SLOT_HEIGHT,
    );

    if (slotsChanged === 0) {
      setLocalState({
        height: item.duration * SLOT_HEIGHT,
        top: 20 + item.start * SLOT_HEIGHT,
      });
      return;
    }

    let newStart = item.start;
    let newDuration = item.duration;

    if (handle === "s") {
      newDuration = item.duration + slotsChanged;
    } else if (handle === "n") {
      const finalDuration = Math.round(size.height / SLOT_HEIGHT);
      const durationDiff = finalDuration - item.duration;
      newStart = item.start - durationDiff;
      newDuration = finalDuration;
    }

    onResizeEnd(item.id, newStart, newDuration);
  };

  const dragStyle =
    transform && !isResizing
      ? {
          transform: CSS.Translate.toString(transform),
          zIndex: 999,
          opacity: 0.8,
        }
      : { zIndex: 10 };

  const tripCategory = {
    0: "관광지",
    1: "숙소",
    2: "식당",
    3: "직접 추가",
    4: "검색",
  };
  const tripColor1 = {
    0: "bg-lime-50",
    1: "bg-orange-50",
    2: "bg-blue-50",
    3: "bg-violet-50",
    4: "bg-gray-50",
  };
  const tripColor2 = {
    0: "bg-lime-100",
    1: "bg-orange-100",
    2: "bg-blue-100",
    3: "bg-violet-100",
    4: "bg-gray-100",
  };
  const tripColor3 = {
    0: "border-lime-500",
    1: "border-orange-500",
    2: "border-blue-500",
    3: "border-violet-500",
    4: "border-gray-500",
  };
  const tripColor4 = {
    0: "text-lime-600",
    1: "text-orange-600",
    2: "text-blue-600",
    3: "text-violet-600",
    4: "text-gray-600",
  };
  const tripColor5 = {
    0: "text-lime-900",
    1: "text-orange-900",
    2: "text-blue-900",
    3: "text-violet-900",
    4: "text-gray-900",
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        top: localState.top,
        height: localState.height,
        position: "absolute",
        left: "4rem",
        right: "8px",
        ...dragStyle,
      }}
      className="absolute touch-none"
      {...attributes}
    >
      <Resizable
        height={localState.height}
        width={200}
        axis="y"
        resizeHandles={["s", "n"]}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeStop={onResizeStop}
        minConstraints={[100, SLOT_HEIGHT]}
        maxConstraints={[100, SLOT_HEIGHT * TOTAL_SLOTS]}
        handle={(h, ref) => <ResizeHandle ref={ref} handleAxis={h} />}
      >
        <div
          {...listeners}
          className={`w-full h-full ${tripColor1[place.categoryId]} border-l-4 ${tripColor3[place.categoryId]} rounded shadow-sm overflow-hidden select-none hover:${tripColor2[place.categoryId]} transition-colors cursor-move
            ${isDragging ? "shadow-xl ring-2 ring-blue-300" : ""}
            ${localState.height <= 80 ? "flex flex-col items-start justify-center px-5" : "p-5"}`}
        >
          <div className="w-full flex items-center gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <div
                className={`font-bold text-lg ${tripColor5[place.categoryId]} truncate pointer-events-none`}
              >
                {place.name}
              </div>

              <div
                className={`text-xs ${tripColor4[place.categoryId]} font-medium pointer-events-none`}
              >
                <p>
                  {tripCategory[place.categoryId]} | {formatTime(item.start)} -{" "}
                  {formatTime(
                    item.start + Math.round(localState.height / SLOT_HEIGHT),
                  )}
                </p>
              </div>
            </div>

            <button
              className={`w-8 h-8 shrink-0 hover:bg-white hover:bg-opacity-50 rounded-full ${tripColor5[place.categoryId]} text-lg`}
              onClick={(e) => e.stopPropagation()}
            >
              ×
            </button>
          </div>
        </div>
      </Resizable>
    </div>
  );
};
