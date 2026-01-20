import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePlanStore from '../../../store/Plan';
import useItemsStore from "../../../store/Schedules";
import useTimetableStore from "../../../store/Timetables";
import { checkOverlap, exportBlock, findEmptySlot, formatTime, getTimeTableId } from "../../../utils/createUtils";
import { getClient, sendRedo, sendUndo } from '../../../websocket/client';
import Sidebar from '../Place/Sidebar';
import { resizeStyles } from '../Timetable/ResizeHandle'; // 스타일 문자열 import
import TimetableGrid from '../Timetable/TimetableGrid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function Main() {
  const client = getClient();

  const {
    items,
    addItemFromDrag,
    moveItem,
    resizeItem,
    addItemMobile,
  } = useItemsStore();

  const [activeTab, setActiveTab] = useState('timetable');
  const [preview, setPreview] = useState(null); 
  const [activeId, setActiveId] = useState(null);
  const gridRef = useRef(null);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const { eventId } = usePlanStore();
  const { TOTAL_SLOTS, SLOT_HEIGHT, selectedDay, timetables } = useTimetableStore();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log(items)
  }, [items])

  const sendWebsocket = (action, block) => {
    if (client && client.connected) {
      const msg = {
        eventId: eventId,
        action: action,
        entity: "timetableplaceblock",
        timeTablePlaceBlockDtos: [
          block
        ]
      };
      client.publish({
        destination: `/app/${id}`,
        body: JSON.stringify(msg),
      });
      console.log("🚀 메시지 전송:", msg);
    }
  }

  // --- DnD Handlers ---
  useDndMonitor({
    onDragStart(event) {
      setActiveId(event.active.id);
    },
    onDragMove(event) {
      const { active, over } = event;
      if (over && over.id === 'timetable-area' && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const currentY = active.rect.current?.translated 
          ? active.rect.current.translated.top 
          : event.activatorEvent.clientY; 

        const relativeY = currentY - gridRect.top + gridRef.current.scrollTop;
        let targetSlot = Math.round(relativeY / SLOT_HEIGHT);
        const duration = active.data.current.duration || 4;

        if (targetSlot < 0) targetSlot = 0;
        if (targetSlot + duration > TOTAL_SLOTS) targetSlot = TOTAL_SLOTS - duration;

        const isOverlap = checkOverlap(targetSlot, duration, items[getTimeTableId(timetables, selectedDay)], active.data.current.type === 'schedule' ? active.id : null);

        setPreview({
          y: targetSlot * SLOT_HEIGHT,
          height: duration * SLOT_HEIGHT,
          isValid: !isOverlap,
          timeText: formatTime(targetSlot)
        });
      } else {
        setPreview(null);
      }
    },
    onDragEnd(event) {
      setPreview(null);
      setActiveId(null);
      
      const { active, over } = event;
      if (!over || over.id !== 'timetable-area') return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const currentY = active.rect.current?.translated?.top ?? event.activatorEvent.clientY;
      const relativeY = currentY - gridRect.top + gridRef.current.scrollTop;
      let newStart = Math.round(relativeY / SLOT_HEIGHT);

      const type = active.data.current.type;
      const duration = active.data.current.duration || 4;
      const place = active.data.current.place;

      if (newStart < 0) newStart = 0;
      if (newStart + duration > TOTAL_SLOTS) newStart = TOTAL_SLOTS - duration;

      const itemId = type === 'schedule' ? active.id : null;
      if (checkOverlap(newStart, duration, items[getTimeTableId(timetables, selectedDay)], itemId)) return; 

      if (type === 'sidebar') {
        const blockId = `item-${Date.now()}`;
        addItemFromDrag({
          timetables,
          selectedDay,
          active,
          newStart,
          duration,
          blockId,
        });
        const block = exportBlock(getTimeTableId(timetables, selectedDay), place, newStart, duration, blockId)
        sendWebsocket("create", block);
      } else if (type === 'schedule') {
        const ttId = getTimeTableId(timetables, selectedDay);
        const latestItem = items[ttId]?.find(it => it.id === active.id);
        const latestPlace = latestItem ? latestItem.place : place;

        moveItem({
          timetables,
          selectedDay,
          activeId: active.id,
          newStart,
        });
        const block = exportBlock(ttId, latestPlace, newStart, duration, active.id)
        sendWebsocket("update", block);
      }
    }
  });

  const handleResizeEnd = (item, newStart, newDuration) => {
    const id = item.id;
    resizeItem({
      timetables,
      selectedDay,
      id,
      newStart,
      newDuration,
      TOTAL_SLOTS,
    });
    const block = exportBlock(getTimeTableId(timetables, selectedDay), item.place, newStart, newDuration, id)
    sendWebsocket("update", block);
  };

  const handleMobileAdd = (place) => {
    const emptySlot = findEmptySlot(4, items[getTimeTableId(timetables, selectedDay)]);
    if (emptySlot === -1) {
      alert('빈 시간이 없습니다!');
      return;
    }
    const blockId = `item-${Date.now()}`;
    addItemMobile({
      timetables,
      selectedDay,
      place,
      emptySlot,
      blockId,
    });
    const block = exportBlock(getTimeTableId(timetables, selectedDay), place, emptySlot, 4, blockId)
    sendWebsocket("create", block);
    
    setActiveTab('timetable');
  };

  const showTimetable = !isMobile || activeTab === 'timetable';
  const showSidebar = !isMobile || activeTab === 'recommend';

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden select-none relative">
      <style>{resizeStyles}</style>

      {/* Undo/Redo Buttons */}
      <div className="absolute top-2 right-[calc(32%+24px)] z-10 flex space-x-2">
        <button
          onClick={() => sendUndo(id)}
          className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-600 transition-colors"
          title="되돌리기 (Ctrl+Z)"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          onClick={() => sendRedo(id)}
          className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-600 transition-colors"
          title="다시실행 (Ctrl+Y / Ctrl+Shift+Z)"
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative md:space-x-6">
        <TimetableGrid 
          ref={gridRef}
          items={items}
          preview={preview}
          onResizeEnd={handleResizeEnd}
          showTimetable={showTimetable}
        />
        <Sidebar 
          planId={id}
          isMobile={isMobile}
          showSidebar={showSidebar}
          handleMobileAdd={handleMobileAdd}
        />
      </div>

      {/* Mobile Bottom Tab */}
      {isMobile && (
        <nav className="mt-4 bg-white border-t h-16 flex shadow-lg">
          <button onClick={() => setActiveTab('timetable')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'timetable' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">📅</span><span className="text-xs font-medium">시간표</span>
          </button>
          <button onClick={() => setActiveTab('recommend')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'recommend' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">📍</span><span className="text-xs font-medium">추천 장소</span>
          </button>
        </nav>
      )}

      {/* Global Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="p-3 bg-blue-600 text-white rounded-lg shadow-2xl w-48 opacity-90 scale-105 cursor-grabbing font-bold flex items-center justify-center">
             이동 중...
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
}