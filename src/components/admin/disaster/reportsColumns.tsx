"use client";

import {
  type DisasterReport,
  type Disaster,
  type DisasterAlert,
} from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import Actions from "./reportsActions";

const columns: ColumnDef<
  DisasterReport & {
    DisasterAlert: DisasterAlert & {
      Disaster: Disaster;
    };
  }
>[] = [
  {
    id: "Name",
    accessorKey: "DisasterAlert.Disaster.name",
    header: "Name",
  },

  {
    id: "Latitude",
    accessorKey: "DisasterAlert.lat",
    header: "Latitude",
  },

  {
    id: "Longitude",
    accessorKey: "DisasterAlert.long",
    header: "Longitude",
  },

  {
    id: "Description",
    accessorKey: "description",
    header: "Description",
  },

  {
    id: "Status",
    accessorKey: "status",
    header: "Status",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions disasterId={row.original.id} />,
  },
];

export default columns;
