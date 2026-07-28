import { create } from "zustand";
import type { WasteRequest } from "@/features/requests/types";

type RequestStore = {
  requests: WasteRequest[];
  setRequests: (requests: WasteRequest[]) => void;
  addRequest: (request: WasteRequest) => void;
  updateRequest: (request: WasteRequest) => void;
};

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (request) =>
    set((state) => ({
      requests: state.requests.map((item) => (item.id === request.id ? request : item)),
    })),
}));
