import { onRequestGet as __api_notes__userId__ts_onRequestGet } from "C:\\dev\\Notes\\notes\\functions\\api\\notes\\[userId].ts"
import { onRequestOptions as __api_notes__userId__ts_onRequestOptions } from "C:\\dev\\Notes\\notes\\functions\\api\\notes\\[userId].ts"
import { onRequestPost as __api_notes__userId__ts_onRequestPost } from "C:\\dev\\Notes\\notes\\functions\\api\\notes\\[userId].ts"
import { onRequestGet as __api_users_ts_onRequestGet } from "C:\\dev\\Notes\\notes\\functions\\api\\users.ts"
import { onRequestOptions as __api_users_ts_onRequestOptions } from "C:\\dev\\Notes\\notes\\functions\\api\\users.ts"
import { onRequestPost as __api_users_ts_onRequestPost } from "C:\\dev\\Notes\\notes\\functions\\api\\users.ts"

export const routes = [
    {
      routePath: "/api/notes/:userId",
      mountPath: "/api/notes",
      method: "GET",
      middlewares: [],
      modules: [__api_notes__userId__ts_onRequestGet],
    },
  {
      routePath: "/api/notes/:userId",
      mountPath: "/api/notes",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_notes__userId__ts_onRequestOptions],
    },
  {
      routePath: "/api/notes/:userId",
      mountPath: "/api/notes",
      method: "POST",
      middlewares: [],
      modules: [__api_notes__userId__ts_onRequestPost],
    },
  {
      routePath: "/api/users",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_users_ts_onRequestGet],
    },
  {
      routePath: "/api/users",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_users_ts_onRequestOptions],
    },
  {
      routePath: "/api/users",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_users_ts_onRequestPost],
    },
  ]