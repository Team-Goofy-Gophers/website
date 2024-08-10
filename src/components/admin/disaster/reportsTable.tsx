import React, { type FunctionComponent } from "react";

import { DataTable } from "~/components/ui/data-table";

import { api } from "~/utils/api";

import columns from "./reportsColumns";

const ReportsTab: FunctionComponent = () => {
  const { data } = api.disaster.getAllDisasterReports.useQuery();

  return <DataTable columns={columns} data={data ?? []} />;
};

export default ReportsTab;
