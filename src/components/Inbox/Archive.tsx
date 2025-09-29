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
  overflow: hidden;
`;

export default function ArchiveContent() {
  const {
    archivedData,
    getArchivedData,
    archivedLoading: loading,
    archivedHasNextPage: hasNextPage,
    archivedLoadingMore: loadingMore,
    getNextArchivedData,
  } = useInbox(useShallow((state) => state));

  const [sentryRef] = useInfiniteScroll({
    disabled: !hasNextPage || loading || loadingMore,
    loading: loading || loadingMore,
    hasNextPage: hasNextPage,
    onLoadMore: () => {
      getNextArchivedData();
    },
    rootMargin: "0px 0px 0px 0px",
  });

  useEffect(() => {
    getArchivedData();
  }, []);

  return (
    <Scrollbars
      className="content"
      style={{
        width: "100%",
        height: "450px",
      }}
    >
      <Wrapper>
        {archivedData?.map((item: any) => (
          <InboxItem key={item.id} data={item} inArchive={true} />
        ))}
        <div ref={sentryRef} />
        {(loading || loadingMore || hasNextPage) && <LoadingItems />}
        {archivedData?.length === 0 && !loading && <Empty />}
      </Wrapper>
    </Scrollbars>
  );
}
