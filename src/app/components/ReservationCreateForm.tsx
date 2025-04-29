"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/client-utils/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "due",
    label: "Due",
  },
  {
    value: "booked",
    label: "Booked",
  },
  {
    value: "pending",
    label: "Pending",
  },
];

const formSchema = z
  .object({
    dateRange: z.object(
      {
        from: z.date(),
        to: z.date(),
      },
      {
        required_error: "You must select a date range.",
      }
    ),

    name: z.object({ value: z.string(), label: z.string() }),
    room: z.object({ value: z.string(), label: z.string() }),
    total: z.string().default("0"),
    status: z.string().default("not-paid"),
    deposit: z.string().default("0"),
  })
  .refine((data) => data.dateRange.from < data.dateRange.to, {
    path: ["dateRange"],
    message: "From date must be before to date",
  });
// add props that are for tenants and rooms

interface ReservationCreateFormProps {
  tenants: { value: string; label: string }[];
  rooms: { value: string; label: string }[];
  userId?: string | null;
  handleOnSubmit: (values: z.infer<typeof formSchema>) => void;
}

const ReservationCreateForm: React.FC<ReservationCreateFormProps> = ({
  tenants,
  rooms,
  userId,
  handleOnSubmit,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [openRoomPopup, setOpenRoomPopup] = React.useState(false);
  const [roomValue, setRoomValue] = React.useState("");
  const [roomCost, setRoomCost] = React.useState(100);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {},
      name: {},
      room: {},
      total: "0",
      status: "not-paid",
      deposit: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  function handleFormattingForDateRange(date: any) {
    // {from: Date, to: Date}
    const result = "Select a Date Range...";
    if (date.from && date.to) {
      return `${format(date.from, "MMM dd, yyyy")} - ${format(
        date.to,
        "MMM dd, yyyy"
      )}`;
    }
    return result;
  }
  const { watch, setValue: setFormValue } = form;
  const dateRange = watch("dateRange");

  React.useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      const duration =
        Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) /
        1000 /
        60 /
        60 /
        24;
      const totalPerDay = 100;
      setFormValue("total", (duration * totalPerDay).toString());
    }
  }, [dateRange, setFormValue]);

  return (
    <>
      <div className="page">
        <div className="w-[80rem]">
          <h1 className="pt-[10px] pl-[30px] font-bold">CREATE RESERVATION</h1>
          <div className=" rounded-xl table-container border bg-card text-card-foreground shadow">
            {/* Form Start */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title">Name</div>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="text-dark"
                            role="combobox"
                            aria-expanded={open}
                            className="selector-box justify-between"
                          >
                            {field.value.value
                              ? tenants.find(
                                  (tenant) => tenant.label === field.value.label
                                )?.label
                              : "Select Tenant..."}
                            <ChevronsUpDown
                              id="text-dark"
                              className="opacity-50"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="selector-box p-0">
                          <Command>
                            <CommandInput
                              className="tenant-search-input"
                              placeholder="Select Tenant"
                            />
                            <CommandList>
                              <CommandEmpty className="no-tenant-option">
                                No Tenant Found
                              </CommandEmpty>
                              <CommandGroup>
                                {tenants.map((tenant, index) => (
                                  <CommandItem
                                    key={index}
                                    className="tenant-option"
                                    value={tenant.label}
                                    onSelect={(currentValue) => {
                                      field.onChange(tenant);
                                      setValue(
                                        currentValue === field.value.value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    {tenant.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value.value === tenant.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="b-box mt-[15px]">
                      <div className="label-title">Date Range for Stay</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "selector-box pl-3 text-left",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                handleFormattingForDateRange(field.value)
                              ) : (
                                <span>Choose Your Dates</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title">Room Number</div>
                      <Popover
                        open={openRoomPopup}
                        onOpenChange={setOpenRoomPopup}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openRoomPopup}
                            className="selector-box justify-between"
                          >
                            {field.value.value
                              ? rooms.find(
                                  (room) => room.label === field.value.label
                                )?.label
                              : "Select Room Number..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="selector-box p-0">
                          <Command>
                            <CommandInput
                              className="tenant-search-input"
                              placeholder="Select Room Number"
                            />
                            <CommandList>
                              <CommandEmpty className="no-tenant-option">
                                No Room Found
                              </CommandEmpty>
                              <CommandGroup>
                                {rooms.map((room) => (
                                  <CommandItem
                                    className="tenant-option"
                                    key={room.value}
                                    value={room.label}
                                    onSelect={(currentValue) => {
                                      field.onChange(room);
                                      setRoomValue(
                                        currentValue === field.value.value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenRoomPopup(false);
                                    }}
                                  >
                                    {room.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value.value === room.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title">Total</div>
                      <FormControl>
                        <div className="flex items-center selector-box">
                          <span className="mr-2">$</span>
                          <Input readOnly {...field} />
                        </div>
                      </FormControl>
                      <FormDescription className="font-bold pt-[15px]">
                        Total amount based on the selected date range.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add Annother form field tha handles a select of enumerable statuses */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="b-box ">
                      <div className="label-title">Status</div>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="selector-box">
                            <SelectValue>
                              {field.value
                                ? statusOptions.find(
                                    (option) => option.value === field.value
                                  )?.label
                                : "Select Status"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                className={cn(
                                  "select-option",
                                  field.value === option.value &&
                                    "selected-option"
                                )}
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="deposit"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title">Deposit</div>
                      <FormControl>
                        <div className="flex items-center selector-box">
                          <span className="mr-2">$</span>
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="font-bold pt-[15px]">
                        Total amount they paid up front.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="b-box">
                  <Button
                    className="mt-[20px] submit-button"
                    type="button"
                    onClick={form.handleSubmit(handleOnSubmit)}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>

            {/* Form End */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationCreateForm;
