import React, { type FunctionComponent } from "react";

import { DataTable } from "~/components/ui/data-table";

import { api } from "~/utils/api";

import columns from "./alertColumns";

const AlertTab: FunctionComponent = () => {
  const { data } = api.disaster.getAllDisasterAlerts.useQuery();

  return <DataTable columns={columns} data={data ?? []} />;
};

export default AlertTab;
