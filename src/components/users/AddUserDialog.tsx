import { useForm, SubmitHandler } from "react-hook-form";
import { format, set } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserUpdate } from "@/types/user";

interface AddUserFormProps {
  defaultValues: UserUpdate;
  onSubmit: SubmitHandler<UserUpdate>;
  onCancel: () => void;
}

const AddUserForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: AddUserFormProps) => {
  const form = useForm<UserUpdate>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="Enter mobile" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  );
};

interface AddUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues: UserUpdate;
  onUpdate: (data: UserUpdate) => void;
}

export const AddUserDialog = ({
  open,
  setOpen,
  defaultValues,
  onUpdate,
}: AddUserDialogProps) => {
  const onCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <AddUserForm
          defaultValues={defaultValues}
          onSubmit={onUpdate}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
