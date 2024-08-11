import { type NextPage } from "next";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import AddDisaster from "~/components/admin/disaster/addDisaster";
import AlertTab from "~/components/admin/disaster/alertTable";
import ReportsTab from "~/components/admin/disaster/reportsTable";

const Disaster: NextPage = () => {
  return (
    <div className="flex h-full pt-[4rem]">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            className="w-1/4 data-[state=active]:w-2/4"
            value="alerts"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger
            className="w-1/4 data-[state=active]:w-2/4"
            value="reports"
          >
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="w-full">
          <AlertTab />
        </TabsContent>
        <TabsContent value="reports" className="w-full">
          <ReportsTab />
        </TabsContent>
      </Tabs>
      <div className="absolute bottom-0 right-0 mb-5 mr-10 flex flex-col gap-3">
        <AddDisaster />
      </div>
    </div>
  );
};

export default Disaster;
