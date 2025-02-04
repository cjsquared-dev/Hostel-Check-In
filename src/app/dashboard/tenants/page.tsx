import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getBookings } from "@/actions/booking.actions";
import { IBooking } from "@/lib/types/interfaces/booking.interface";

export default async function Page() {
  const data = [
    {
      name: "John E Doe.",
      phone: "801-420-6491",
      email: "janeedow@gmail.com",
      balance: "$0.00",
    },
    {
      name: "John E Doe.",
      phone: "801-420-6491",
      email: "janeedow@gmail.com",
      balance: "$0.00",
    },
    {
      name: "John E Doe.",
      phone: "801-420-6491",
      email: "janeedow@gmail.com",
      balance: "$0.00",
    },
    {
      name: "John E Doe.",
      phone: "801-420-6491",
      email: "janeedow@gmail.com",
      balance: "$0.00",
    },
  ];

  const statusMap: { [key in "paid" | "not-paid" | "pending"]: string } = {
    paid: "Paid",
    "not-paid": "Not Paid",
    pending: "Pending",
  };

  return (
    <>
      <div className="page">
        <div className="w-full">
          <h1 className="pt-[10px] pl-[30px] font-bold">DASHBOARD</h1>

          <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
            <div className="button-container align-middle content-center">
              <h1 className="pb-[20px]">Tenants</h1>
              <div className="add-new-button-container">
                <div className="add-button-container circular-styled-container">
                  <Link
                    href="/dashboard/tenants/create"
                    className="circular-styled-button p-4 -my-6 border-2 border-[var(--dark-button)] bg-[var(--dark-button)] rounded-lg text-[var(--light)] cursor-pointer hover:bg-[var(--contrast)] hover:text-[var(--dark-button)] hover:border-[var(--contrast)]"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader className="table-row-header">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone #</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rowData: any, index: number) => {
                  return (
                    <TableRow key={index} className="table-data-row">
                      <TableCell>{rowData.name}</TableCell>
                      <TableCell>{rowData.phone}</TableCell>
                      <TableCell>{rowData.email}</TableCell>
                      <TableCell>{rowData.balance}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
