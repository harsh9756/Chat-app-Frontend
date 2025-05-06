import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import chatReducer from "./ChatSlice";
import onlineReducer from "./OnlineSlice";

const store = configureStore({
    reducer: { theme: themeReducer, chat: chatReducer, online: onlineReducer }
})

export default store;