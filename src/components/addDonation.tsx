import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import React, { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { api } from "~/utils/api";
import { addDonationZ } from "~/zod/donationZ";

const AddDonation: FunctionComponent<{
  disasterId: string;
}> = ({ disasterId }) => {
  const [open, setOpen] = useState(false);

  const { data: supportAmount, refetch } =
    api.support.getSupportAmount.useQuery({
      disasterId,
    });

  const addDonation = api.support.submitSupport.useMutation();

  const formSchema = addDonationZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disasterId,
      amount: 1,
      amount2: "100",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addDonation.mutate(
      {
        amount: parseInt(values.amount2),
        disasterId: values.disasterId,
      },
      {
        onSuccess: () => {
          refetch().then().catch(console.error);
          toast.success(`Amount ${values.amount} donated to disaster`);
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
        <Button>Support </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Donate to Support</DialogTitle>
              <DialogDescription className="flex flex-col gap-3 pt-5">
                <span>
                  We have already managed to collect{" "}
                  {supportAmount?.totalSupportAmount ?? 0} ₹ for the good cause
                </span>
                <span>Your one donation may save one life</span>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="amount2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 ₹</SelectItem>
                        <SelectItem value="500">500 ₹</SelectItem>
                        <SelectItem value="1000">1,000 ₹</SelectItem>
                        <SelectItem value="5000">5,000 ₹</SelectItem>
                        <SelectItem value="10000">10,000 ₹</SelectItem>
                        <SelectItem value="50000">50,00 ₹</SelectItem>
                        <SelectItem value="100000">1,00,000 ₹</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Donate</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonation;
