"use client";

import { getDefaultDateRange } from "@/components/shared/helpers";
import { Dayjs } from "dayjs";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DashboardState {
  date: [Dayjs | null, Dayjs | null];
  setDate: (payload: any) => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      date: getDefaultDateRange(),

      setDate: (payload: any) => {
        set({
          date: payload,
        });
      },
    }),
    {
      name: "dashboard-storage-1",
      storage: createJSONStorage(() => sessionStorage),

      partialize: () => {
        return {};
      },
    }
  )
);
