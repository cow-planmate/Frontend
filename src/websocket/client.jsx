import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import usePlanStore from "../store/Plan";
import useUserStore from "../store/Users";
import useTimetableStore from "../store/Timetables";
import useNicknameStore from "../store/Nickname";

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
  if (isDifferentEventId(eventId)) {
    console.log("📩 수신된 메시지:", body);
    usePlanStore.getState().setPlanAll(body.planDtos[0]);
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
        }
      });

      client.subscribe(`/topic/plan-presence/${id}`, (message) => {
        const body = JSON.parse(message.body);
        console.log("(접속자) 수신된 메시지:", body);
        useUserStore.getState().setUserAll(body.users);
      });

      // client.subscribe(`/topic/plan/${id}/update/plan`, (message) => {
      //   const body = JSON.parse(message.body);
      //   const planEventId = usePlanStore.getState().eventId;
      //   if (planEventId !== body.eventId) {
      //     console.log("📩 수신된 메시지:", message.body);
      //     usePlanStore.getState().setPlanAll({...body, eventId: planEventId});
      //   }
      // });

      // client.subscribe(`/topic/plan/${id}/create/timetable`, (message) => {
      //   const body = JSON.parse(message.body);
      //   console.log("📩 수신된 메시지:", message.body);
      //   body.timetableVOs.map((item) => {
      //     useTimetableStore.getState().setTimetableCreate(item);
      //   })
      // });

      // client.subscribe(`/topic/plan/${id}/update/timetable`, (message) => {
      //   const body = JSON.parse(message.body);
      //   console.log("📩 수신된 메시지:", message.body);
      //   body.timetableVOs.map((item) => {
      //     useTimetableStore.getState().setTimetableUpdate(item);
      //   })
      // });

      // client.subscribe(`/topic/plan/${id}/delete/timetable`, (message) => {
      //   const body = JSON.parse(message.body);
      //   console.log("📩 수신된 메시지:", message.body);
      //   body.timetableVOs.map((item) => {
      //     useTimetableStore.getState().setTimetableDelete(item);
      //   })
      // });

      // client.subscribe(
      //   `/topic/plan/${id}/create/timetableplaceblock`,
      //   (message) => {
      //   }
      // );

      // client.subscribe(
      //   `/topic/plan/${id}/update/timetableplaceblock`,
      //   (message) => {
          
      //   }
      // );

      // client.subscribe(
      //   `/topic/plan/${id}/delete/timetableplaceblock`,
      //   (message) => {
          
      //   }
      // );

      // client.subscribe(
      //   `/topic/plan/${id}/delete/presence`, (message) => {
      //     const body = JSON.parse(message.body);
      //     console.log("📩 수신된 메시지:", message.body);
      //     useUserStore.getState().setUserDelete(body);
      //   }
      // );

      // client.subscribe(
      //   `/topic/plan/${id}/update/presence`,
      //   (message) => {
      //     const body = JSON.parse(message.body);
      //     console.log("📩 수신된 메시지:", message.body);
      //     useUserStore.getState().setUserUpdate(body);
      //   }
      // );

      // client.subscribe(
      //   `/topic/plan/${id}/create/presence`,
      //   (message) => {
      //     const body = JSON.parse(message.body);
      //     console.log("📩 수신된 메시지:", message.body);
      //     useUserStore.getState().setUserCreate(body);
      //   }
      // );
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