import { type NextPage } from "next";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import AddDisaster from "~/components/admin/disaster/addDisaster";

const Disaster: NextPage = () => {
  return (
    <div className="m-10 flex h-full">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            className="w-1/4 data-[state=active]:w-2/4"
            value="disaster"
          >
            Disaster
          </TabsTrigger>
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
        <TabsContent value=""></TabsContent>
      </Tabs>
      <div className="absolute bottom-0 right-0 mb-5 mr-10">
        <AddDisaster />
      </div>
    </div>
  );
};

export default Disaster;
