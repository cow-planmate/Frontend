import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import usePlanStore from "../store/Plan";
import useUserStore from "../store/UserDayIndexes";
import useTimetableStore from "../store/Timetables";
import useNicknameStore from "../store/Nickname";

let client;

export const getClient = () => client;
export const initStompClient = (id) => {
  const token = localStorage.getItem('accessToken');
  const BASE_URL = import.meta.env.VITE_API_URL;
  const SERVER_URL = `${BASE_URL}/ws-plan?token=${encodeURIComponent(token)}`;

  console.log("🔄 WebSocket 연결 시도 중...", SERVER_URL);

  const socket = new SockJS(SERVER_URL);
  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 3000,
    onConnect: (frame) => {
      console.log("✅ WebSocket 연결 완료:", frame);

      client.subscribe(`/topic/plan/${id}/update/plan`, (message) => {
        const body = JSON.parse(message.body);
        const planEventId = usePlanStore.getState().eventId;
        if (planEventId !== body.eventId) {
          console.log("📩 수신된 메시지:", message.body);
          usePlanStore.getState().setPlanAll({...body, eventId: planEventId});
        }
      });

      // client.subscribe(`/topic/plan/${id}/create/timetable`, (message) => {
      //   //
      // });

      // client.subscribe(`/topic/plan/${id}/update/timetable`, (message) => {
      //   //
      // });

      // client.subscribe(`/topic/plan/${id}/delete/timetable`, (message) => {
      //   //  
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

      client.subscribe(
        `/topic/plan/${id}/delete/presence`, (message) => {
          const body = JSON.parse(message.body);
          console.log("📩 수신된 메시지:", message.body);
          useUserStore.getState().setUserDelete(body);
        }
      );

      client.subscribe(
        `/topic/plan/${id}/update/presence`,
        (message) => {
          const body = JSON.parse(message.body);
          console.log("📩 수신된 메시지:", message.body);
          useUserStore.getState().setUserUpdate(body);
        }
      );

      client.subscribe(
        `/topic/plan/${id}/create/presence`,
        (message) => {
          const body = JSON.parse(message.body);
          console.log("📩 수신된 메시지:", message.body);
          useUserStore.getState().setUserCreate(body);
        }
      );
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
      console.log(state);
      
      if (client.connected) {
        client.publish({
          destination: `/app/plan/${id}/update/plan`,
          body: JSON.stringify(state),
        });
      }
    }
  });
  
  useTimetableStore.subscribe((next, prev) => {
    if (next.selectedDay !== prev.selectedDay) {
      const msg = {
        "userDayIndexVOs": {
          "userDayIndexVO": {
            "nickname": useNicknameStore.getState().nickname,
            "dayIndex": next.selectedDay
          }
        }
      }

      if (client.connected) {
        console.log("웹소켓을 전송합니다.", msg)
        client.publish({
          destination: `/app/plan/${id}/update/presence`,
          body: JSON.stringify(msg),
        });
      }
    }
  });
}