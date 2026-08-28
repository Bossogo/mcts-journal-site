import { runMCTS } from "./mcts";
import type { WorkerSearchRequest, WorkerSearchResponse } from "./types";

self.onmessage = (event: MessageEvent<WorkerSearchRequest>) => {
  const msg = event.data;
  if (msg.type !== "search") return;

  const { result } = runMCTS(msg.state, msg.config);

  const response: WorkerSearchResponse = {
    type: "result",
    id: msg.id,
    result,
  };

  self.postMessage(response);
};
