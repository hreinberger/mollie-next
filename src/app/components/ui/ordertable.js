"use server";

import {
  Flex,
  TableRoot,
  TableHeader,
  TableRow,
  TableColumnHeaderCell,
  TableCell,
  TableBody,
  TableRowHeaderCell,
  Link as Rlink,
} from "@radix-ui/themes";
import { monduOrders } from "@/app/lib/mondu";
import Link from "next/link";

import StateBadge from "./orderStateBadge";

export default async function Ordertable({ page, per_page }) {
  const orders = await monduOrders(page, per_page);
  return (
    <Flex justify="center" pt="4">
      <Flex>
        <TableRoot variant="surface">
          <TableHeader>
            <TableRow>
              <TableColumnHeaderCell>UUID</TableColumnHeaderCell>
              <TableColumnHeaderCell>Order ID</TableColumnHeaderCell>
              <TableColumnHeaderCell>State</TableColumnHeaderCell>
              <TableColumnHeaderCell>Buyer</TableColumnHeaderCell>
              <TableColumnHeaderCell>Created At</TableColumnHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.values(orders).map((order, index) => (
              <TableRow key={index}>
                <>
                  <TableRowHeaderCell>
                    <Rlink>
                      <Link href={"/orders/" + order.uuid}>{order.uuid}</Link>
                    </Rlink>
                  </TableRowHeaderCell>
                </>
                <TableCell>{order.external_reference_id}</TableCell>
                <TableCell>
                  <StateBadge state={order.state} />
                </TableCell>
                <TableCell>{order.buyer_name}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </Flex>
    </Flex>
  );
}
