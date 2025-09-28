"use client";

import { useState } from "react";
import { CustomizeChip } from "../shared/CustomizeChip";
import { TeamModel } from "@/lib/graphql/generated/graphql";
import { teamStatuses } from "../utils/constants";
import ChangeStatus from "./ChangeStatus";

export default function Status({ data }: { data: TeamModel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomizeChip
        options={teamStatuses}
        value={data?.status}
        onClick={() => setOpen(true)}
      />

      <ChangeStatus open={open} setOpen={setOpen} data={data} />
    </>
  );
}
