import { type NextPage } from "next";
import Link from "next/link";
import React from "react";

const Admin: NextPage = () => {
  return (
    <div>
      Admin
      <li>
        <Link href="/admin/disaster">Disaster</Link>
      </li>
    </div>
  );
};

export default Admin;
