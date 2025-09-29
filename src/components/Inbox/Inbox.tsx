"use client";
import { styled } from "@mui/material";
import { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useShallow } from "zustand/react/shallow";
import Empty from "./components/Empty";
import InboxItem from "./components/InboxItem";
import LoadingItems from "./components/LoadingItems";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInbox } from "../../../store/useInbox";

const Wrapper = styled("div")`
  height: 100vh;
  overflow: hidden;

  .scroll-container {
    flex: 1;
    overflow: hidden;
  }

  .footer {
    padding: 16px;
    text-align: center;
    cursor: pointer;
  }
`;

export default function InboxContent() {
  const {
    inboxData,
    getInboxData,
    inboxLoading: loading,
    inboxHasNextPage: hasNextPage,
    inboxLoadingMore: loadingMore,
    getNextInboxData,
    archiveItems,
  } = useInbox(useShallow((state) => state));

  const [sentryRef] = useInfiniteScroll({
    disabled: !hasNextPage || loading || loadingMore,
    loading: loading || loadingMore,
    hasNextPage: hasNextPage,
    onLoadMore: () => {
      getNextInboxData();
    },
    rootMargin: "0px 0px 0px 0px",
  });

  const isMobile = window.innerWidth <= 768;
  const autoHeightMax = isMobile ? "calc(100vh - 160px)" : 400;

  useEffect(() => {
    getInboxData();
  }, []);

  return (
    <Wrapper>
      <div className="scroll-container">
        <Scrollbars
          className="content"
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={400}
          autoHeightMax={autoHeightMax}
          thumbMinSize={30}
          style={{
            width: "100%",
          }}
        >
          {inboxData?.map((item: any) => (
            <InboxItem key={item.id} data={item} />
          ))}
          <div ref={sentryRef} />
          {(loading || loadingMore || hasNextPage) && <LoadingItems />}
          {inboxData?.length === 0 && !loading && <Empty />}
        </Scrollbars>
      </div>
      {inboxData?.length > 0 && !loading && (
        <div className="footer" onClick={() => archiveItems("Archive all")}>
          Alle archivieren
        </div>
      )}
    </Wrapper>
  );
}
