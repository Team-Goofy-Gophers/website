"use client";

import { type Disaster, type DisasterAlert } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

import Actions from "./alertActions";

const columns: ColumnDef<DisasterAlert & { Disaster: Disaster }>[] = [
  {
    id: "Name",
    accessorKey: "Disaster.name",
    header: "Name",
  },

  {
    id: "Latitude",
    accessorKey: "lat",
    header: "Latitude",
  },

  {
    id: "Longitude",
    accessorKey: "long",
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
