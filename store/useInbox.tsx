import { extractNodes, extractPageInfo } from "@/components/shared/helpers";
import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import {
  ArchiveAllNotificationsDocument,
  ArchiveNotificationDocument,
  InboxDocument,
  InboxQuery,
  NotificationModel,
} from "@/lib/graphql/generated/graphql";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface InboxState {
  // Separate inbox and archived data
  inboxData: NotificationModel[];
  archivedData: NotificationModel[];
  // Separate cursors and pagination for inbox and archived data
  inboxStartCursor: any;
  inboxEndCursor: any;
  inboxHasNextPage: boolean;
  inboxHasPreviousPage: boolean;
  archivedStartCursor: any;
  archivedEndCursor: any;
  archivedHasNextPage: boolean;
  archivedHasPreviousPage: boolean;
  // Separate loading states
  inboxLoading: boolean;
  archivedLoading: boolean;
  inboxLoadingMore: boolean;
  archivedLoadingMore: boolean;
  activeTab: "inbox" | "archived";
  setActiveTab: (tab: "inbox" | "archived") => void;
  // Fetch and pagination functions
  getInboxData: () => void;
  getArchivedData: () => void;
  getNextInboxData: () => void;
  getNextArchivedData: () => void;
  archiveItems: (t: any) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
  unarchiveItem: (id: string) => Promise<void>;
}

export const useInbox = create<InboxState>()(
  persist(
    (set, get) => ({
      inboxData: [],
      archivedData: [],
      inboxLoading: true,
      archivedLoading: true,
      inboxLoadingMore: false,
      archivedLoadingMore: false,
      inboxStartCursor: null,
      inboxEndCursor: null,
      inboxHasNextPage: false,
      inboxHasPreviousPage: false,
      archivedStartCursor: null,
      archivedEndCursor: null,
      archivedHasNextPage: false,
      archivedHasPreviousPage: false,
      activeTab: "inbox",
      setActiveTab: (tab: "inbox" | "archived") => {
        set({ activeTab: tab });
      },
      archiveItems: async (t: any) => {
        const oldInbox = get().inboxData;
        const oldArchived = get().archivedData;
        try {
          set({
            inboxLoading: true,
            archivedData: [...get().inboxData, ...get().archivedData],
            inboxData: [],
          });
          await apolloClient.mutate({
            mutation: ArchiveAllNotificationsDocument,
          });
          set({
            inboxLoading: false,
          });
        } catch (error) {
          console.log(error);
          toast.error(t("inbox.failedToArchiveAllItems"));
          set({
            inboxData: oldInbox,
            archivedData: oldArchived,
            inboxLoading: false,
          });
        }
      },
      archiveItem: async (id: string) => {
        const itemToArchive = get().inboxData.find((item) => item.id === id);
        if (!itemToArchive) return;

        const oldInbox = get().inboxData;
        const oldArchived = get().archivedData;

        try {
          set({
            inboxData: get().inboxData.filter((item) => item.id !== id),
            archivedData: [itemToArchive, ...get().archivedData],
          });
          await apolloClient.mutate({
            mutation: ArchiveNotificationDocument,
            variables: {
              input: {
                id,
                archived: true,
              },
            },
          });
        } catch (error) {
          toast.error("Failed to archive item");
          console.log(error);
          set({
            inboxData: oldInbox,
            archivedData: oldArchived,
          });
        }
      },
      unarchiveItem: async (id: string) => {
        const itemToUnarchive = get().archivedData.find(
          (item) => item.id === id
        );
        if (!itemToUnarchive) return;

        const oldInbox = get().inboxData;
        const oldArchived = get().archivedData;

        try {
          set({
            inboxLoading: true,
            archivedData: get().archivedData.filter((item) => item.id !== id),
            inboxData: [itemToUnarchive, ...get().inboxData],
          });
          await apolloClient.mutate({
            mutation: ArchiveNotificationDocument,
            variables: {
              input: {
                id,
                archived: false,
              },
            },
          });
          set({
            inboxLoading: false,
          });
        } catch (error) {
          toast.error("Failed to unarchive item");
          console.log(error);
          set({
            inboxData: oldInbox,
            archivedData: oldArchived,
            inboxLoading: false,
          });
        }
      },

      getInboxData: async () => {
        const res = await apolloClient.query<InboxQuery>({
          query: InboxDocument,
          fetchPolicy: "no-cache",
          variables: {
            input: {
              archived: false,
            },
          },
        });

        const items = extractNodes(res.data.inbox);
        const pageInfo = extractPageInfo(res.data.inbox);

        set({
          inboxData: items,
          inboxLoading: false,
          inboxStartCursor: pageInfo?.startCursor,
          inboxEndCursor: pageInfo?.endCursor,
          inboxHasNextPage: pageInfo?.hasNextPage,
          inboxHasPreviousPage: pageInfo?.hasPreviousPage,
        });
      },
      getArchivedData: async () => {
        const res = await apolloClient.query<InboxQuery>({
          query: InboxDocument,
          fetchPolicy: "no-cache",
          variables: {
            input: {
              archived: true,
            },
          },
        });

        const items = extractNodes(res.data.inbox);
        const pageInfo = extractPageInfo(res.data.inbox);

        set({
          archivedData: items,
          archivedLoading: false,
          archivedStartCursor: pageInfo?.startCursor,
          archivedEndCursor: pageInfo?.endCursor,
          archivedHasNextPage: pageInfo?.hasNextPage,
          archivedHasPreviousPage: pageInfo?.hasPreviousPage,
        });
      },
      getNextInboxData: async () => {
        const {
          inboxEndCursor,
          inboxLoading,
          inboxLoadingMore,
          inboxHasNextPage,
        } = get();

        if (inboxLoading || inboxLoadingMore || !inboxHasNextPage) return;

        set({ inboxLoadingMore: true });
        try {
          const res = await apolloClient.query<InboxQuery>({
            query: InboxDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                archived: false,
                cursor: inboxEndCursor,
              },
            },
          });

          const items = extractNodes(res.data.inbox);
          const pageInfo = extractPageInfo(res.data.inbox);

          set({
            inboxData: [...get().inboxData, ...items],
            inboxStartCursor: pageInfo?.startCursor,
            inboxEndCursor: pageInfo?.endCursor,
            inboxHasNextPage: pageInfo?.hasNextPage ?? false,
            inboxHasPreviousPage: pageInfo?.hasPreviousPage,
            inboxLoadingMore: pageInfo?.hasNextPage ?? false,
          });
        } catch (error) {
          console.log(error);
        } finally {
          set({ inboxLoadingMore: false });
        }
      },
      getNextArchivedData: async () => {
        const {
          archivedEndCursor,
          archivedLoading,
          archivedLoadingMore,
          archivedHasNextPage,
        } = get();

        if (archivedLoading || archivedLoadingMore || !archivedHasNextPage)
          return;

        set({ archivedLoadingMore: true });
        try {
          const res = await apolloClient.query<InboxQuery>({
            query: InboxDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                archived: true,
                cursor: archivedEndCursor,
              },
            },
          });

          const items = extractNodes(res.data.inbox);
          const pageInfo = extractPageInfo(res.data.inbox);

          set({
            archivedData: [...get().archivedData, ...items],
            archivedStartCursor: pageInfo?.startCursor,
            archivedEndCursor: pageInfo?.endCursor,
            archivedHasNextPage: pageInfo?.hasNextPage ?? false,
            archivedHasPreviousPage: pageInfo?.hasPreviousPage,
            archivedLoadingMore: pageInfo?.hasNextPage ?? false,
          });
        } catch (error) {
          console.log(error);
        } finally {
          set({ archivedLoadingMore: false });
        }
      },
    }),
    {
      name: "inbox-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: InboxState) => {
        return {
          inboxData: state.inboxData,
          archivedData: state.archivedData,
          inboxLoading: state.inboxLoading,
          archivedLoading: state.archivedLoading,
        };
      },
    }
  )
);
