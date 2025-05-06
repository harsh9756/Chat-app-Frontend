import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "Chats",
  initialState: [], // Initial state is an empty array
  reducers: {
    createChat(state, action) {
      return action.payload; // Set the state to the payload of the createChat action
    },
    updateChat(state, action) {
      const chatIndex = state.findIndex((chat) => chat._id === action.payload.chatId);
      if (chatIndex !== -1) {
        state[chatIndex].latestMessage = action.payload;
      }
      state.sort((a, b) => {
        const aIsRead = a.latestMessage?.isRead ?? true; // Defaults to true if latestMessage is null
        const bIsRead = b.latestMessage?.isRead ?? true;
        return aIsRead === bIsRead ? 0 : aIsRead ? 1 : -1;
      });
    },
    updateRead(state, action) {
      const chatIndex = state.findIndex((chat) => chat._id === action.payload);
      console.log(chatIndex)
      if (chatIndex !== -1) {
        if (state[chatIndex].latestMessage) { 
          state[chatIndex].latestMessage.isRead = true;
        }
      }
    },
    appendChat(state, action) {
      const exists = state.some(chat => chat._id === action.payload._id);
      if (!exists) {
        state.unshift(action.payload);
      }
    }
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
