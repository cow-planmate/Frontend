import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import usePlanStore from "../store/Plan";
import useUserStore from "../store/Users";
import useTimetableStore from "../store/Timetables";
import useItemsStore from "../store/Schedules";

let client;

function getTimeSlotIndex(timeTableStartTime, time, intervalMinutes = 15) {
  const toMinutes = (t) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 60 + m + s / 60;
  };

  const startMinutes = toMinutes(timeTableStartTime);
  const targetMinutes = toMinutes(time);

  return Math.floor((targetMinutes - startMinutes) / intervalMinutes);
}

function isDifferentEventId(eventId) {
  const prevEventId = usePlanStore.getState().eventId;
  if (eventId != "" && prevEventId != "" && eventId !== prevEventId) {
    return true;
  }
  return false;
}

function convertBlock(block) {
  const timeTableId = block.timeTableId;
  const {timetables} = useTimetableStore.getState();
  const timeTableStartTime = timetables.find(
    (t) => t.timeTableId === timeTableId
  )?.timeTableStartTime;
  const start = getTimeSlotIndex(timeTableStartTime, block.blockStartTime);
  const duration = getTimeSlotIndex(block.blockStartTime, block.blockEndTime);
  const blockId = block.placeTheme;
  console.log(start)
  console.log(duration)

  const place = {
    placeId: block.placePhotoId,
    categoryId: block.placeCategoryId,
    url: block.placeLink,
    name: block.placeName,
    formatted_address: block.placeAddress,
    rating: block.placeRating,
    iconUrl: "./src/assets/imgs/default.png",
    xlocation: block.xLocation,
    ylocation: block.yLocation,
  }

  return {timeTableId, place, start, duration, blockId};
}

const plan = (body) => {
  const eventId = body.eventId;
  console.log("📩 수신된 메시지:", body);
  if (isDifferentEventId(eventId)) {
    usePlanStore.getState().setPlanAll(body.planDtos[0]);
  }
}

const timetable = (body) => {
  const action = body.action;
  switch(action) {
    case "create":
      body.timeTableDtos.map((item) => {
        console.log(item)
        useTimetableStore.getState().setTimetableCreate(item);
      });
      break;
    case "update":
      body.timeTableDtos.map((item) => {
        useTimetableStore.getState().setTimetableUpdate(item);
      });
      break;
    case "delete":
      body.timeTableDtos.map((item) => {
        useTimetableStore.getState().setTimetableDelete(item.timeTableId);
      });
      break;
  }
}

const timetableplaceblock = (body) => {
  const eventId = body.eventId;
  if (isDifferentEventId(eventId)) {
    console.log("📩 수신된 메시지:", body);
    const action = body.action;
    
    switch(action) {
      case "create":
        body.timeTablePlaceBlockDtos.map((item) => {
          const convert = convertBlock(item);
          useItemsStore.getState().addItemFromWebsocket(convert);
        })
        break;
      case "update":
        body.timeTablePlaceBlockDtos.map((item) => {
          const convert = convertBlock(item);
          useItemsStore.getState().moveItemFromWebsocket(convert);
        })
        break;
      case "delete":
        body.timeTablePlaceBlockDtos.map((item) => {
          useItemsStore.getState().deleteItem(item.placeTheme, item.timeTableId);
        })
        break;
    }
  }
}

export const getClient = () => client;
export const initStompClient = (id) => {
  const token = localStorage.getItem('accessToken');
  const BASE_URL = import.meta.env.VITE_API_URL;
  const SERVER_URL = `${BASE_URL}/ws?token=${encodeURIComponent(token)}`;

  console.log("🔄 WebSocket 연결 시도 중...", SERVER_URL);

  const socket = new SockJS(SERVER_URL);
  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 3000,
    onConnect: (frame) => {
      console.log("✅ WebSocket 연결 완료:", frame);

      client.subscribe(`/topic/${id}`, (message) => {
        const body = JSON.parse(message.body);
        const entity = body.entity;
        
        switch(entity) {
          case "plan":
            plan(body);
            break;
          case "timetable":
            timetable(body);
            break;
          case "timetableplaceblock":
            timetableplaceblock(body);
            break;
        }
      });

      client.subscribe(`/topic/plan-presence/${id}`, (message) => {
        const body = JSON.parse(message.body);
        console.log("(접속자) 수신된 메시지:", body);
        useUserStore.getState().setUserAll(body.users);
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
      client.deactivate();
    },

    // onWebSocketClose: () => {
    //   console.log("🔌 WebSocket 연결 종료");
    //   client.deactivate();
    // },
  });

  client.activate();

  usePlanStore.subscribe((state, prevState) => {
    if (JSON.stringify(state) !== JSON.stringify(prevState)) {
      const { eventId, setEventId, setPlanAll, setPlanField, ...payload } = state;
      console.log(payload)
      if (client.connected) {
        const requestMsg = {
          "eventId": eventId,
          "action": "update",
          "entity": "plan",
          "planDtos": [{
            ...payload
          }]
        };
        console.log(requestMsg)
        client.publish({
          destination: `/app/${id}`,
          body: JSON.stringify(requestMsg),
        });
      }
    }
  });
}