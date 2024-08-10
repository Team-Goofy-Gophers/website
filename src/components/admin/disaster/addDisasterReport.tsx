import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
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

import { api } from "~/utils/api";
import { addDisasterReportNewZ } from "~/zod/disaster";

const AddDisasterReportNew: FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  const addDisasterReportNew = api.disaster.addDisasterReportNew.useMutation();

  const formSchema = addDisasterReportNewZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      disasterId: "",
      location: "",
      status: "ONGOING",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addDisasterReportNew.mutate(
      {
        description: values.description,
        location: values.location,
        status: values.status,
        disasterId: values.disasterId,
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
          Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
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

            {/* TODO: images */}

            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDisasterReportNew;
