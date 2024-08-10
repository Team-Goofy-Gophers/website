import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { ComboBox } from "~/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

import { useLocationStore } from "~/store";
import { api } from "~/utils/api";
import { addDisasterReportExistingZ } from "~/zod/disaster";

const AddDisasterReportExisting: FunctionComponent = () => {
  const { lat, lng } = useLocationStore();

  const [open, setOpen] = useState(false);

  const { data } = api.disaster.getDisasterAlerts.useQuery({
    location: `${lat}|${lng}`,
    status: "ONGOING",
  });

  const disasterAlerts = data?.map((ele) => ({
    id: ele.id,
    name: ele.Disaster.name,
  }));

  const addDisasterReportExisting =
    api.disaster.addDisasterReportExisting.useMutation();

  const formSchema = addDisasterReportExistingZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      disasterAlertId: "",
      status: "ONGOING",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addDisasterReportExisting.mutate(
      {
        description: values.description,
        status: values.status,
        disasterAlertId: values.disasterAlertId,
      },
      {
        onSuccess: () => {
          toast.success(`Disaster reported successfully`);
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <LuPlus className="mr-2 size-5" />
          Report Disaster
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Report Disaster</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disasterAlertId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disaster</FormLabel>
                  <FormControl>
                    <ComboBox
                      data={disasterAlerts ?? []}
                      placeholder="Seacrh disasters..."
                      value={field.value}
                      setValue={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDisasterReportExisting;
