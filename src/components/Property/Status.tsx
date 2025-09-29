"use client";

import { useState } from "react";
import { CustomizeChip } from "../shared/CustomizeChip";
import { PropertyModel } from "@/lib/graphql/generated/graphql";
import { propertyStatuses } from "../utils/constants";
import ChangeStatus from "./ChangeStatus";

export default function Status({ data }: { data: PropertyModel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomizeChip
        options={propertyStatuses}
        value={data?.status}
        onClick={() => setOpen(true)}
      />

      <ChangeStatus open={open} setOpen={setOpen} data={data} />
    </>
  );
}
