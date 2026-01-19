import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import usePlanStore from "../store/Plan";
import useUserStore from "../store/Users";
import useTimetableStore from "../store/Timetables";
import useItemsStore from "../store/Schedules";
import { convertBlock } from "../utils/createUtils";

let client;

function isDifferentEventId(eventId) {
  const prevEventId = usePlanStore.getState().eventId;
  if (eventId != "" && prevEventId != "" && eventId !== prevEventId) {
    return true;
  }
  return false;
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
          if (convert) useItemsStore.getState().addItemFromWebsocket(convert);
        })
        break;
      case "update":
        body.timeTablePlaceBlockDtos.map((item) => {
          const convert = convertBlock(item);
          if (convert) useItemsStore.getState().moveItemFromWebsocket(convert);
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

export const disconnectStompClient = () => {
  if (client) {
    console.log("🔌 WebSocket 연결 종료 중...");
    client.deactivate();
    client = null;
  }
};

export const initStompClient = (id) => {
  if (client && client.active) {
    console.log("⚠️ 이미 활성화된 WebSocket 클라이언트가 있습니다. 기존 연결을 종료합니다.");
    client.deactivate();
  }

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
        console.log("📩 [WebSocket] 수신 데이터 (Topic):", body);
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
        console.log("👥 [WebSocket] 접속자 수신 데이터:", body);
        useUserStore.getState().setUserAll(body.users);
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
      client.deactivate();
    },
  });

  client.activate();

  usePlanStore.subscribe((state, prevState) => {
    if (JSON.stringify(state) !== JSON.stringify(prevState)) {
      const { eventId, setEventId, setPlanAll, setPlanField, ...payload } = state;
      console.log(payload)
      if (client.connected && eventId) {
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