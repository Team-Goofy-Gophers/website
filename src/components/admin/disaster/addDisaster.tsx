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
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";

import { api } from "~/utils/api";
import { addDisasterZ } from "~/zod/disaster";

const AddDisaster: FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  const addDisaster = api.disaster.addDisaster.useMutation();

  const formSchema = addDisasterZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      intensity: 30,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addDisaster.mutate(
      {
        name: values.name,
        intensity: values.intensity,
      },
      {
        onSuccess: () => {
          toast.success(`Disaster ${values.name} added successfully`);
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
          Disaster
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Add Disaster</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intensity</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(e) => field.onChange(e[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDisaster;
