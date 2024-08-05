import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { api } from "../../config/api";
import dayjs from "dayjs";
import { capitalize } from "../../config/string";
import { useNavigate } from "react-router-dom";

const steps = [
  "Placed",
  "Conformed",
  "Shipped",
  "Out of delivery",
  "Delivered",
];

const columns = [
  { id: "date", label: "Order date", minWidth: 170 },
  { id: "price", label: "Paid amount", minWidth: 100 },
  {
    id: "qty",
    label: "Total items",
    minWidth: 170,
  },
  {
    id: "status",
    label: " Current order status",
    minWidth: 170,
  },
  {
    id: "details",
    label: "Details",
    minWidth: 170,
  },
];

export default function TrackOrder() {
  const [rows, setRows] = useState([]);
  const noOfOrders = rows.length;
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      const response = await api.get("/api/user/order/all");

      const formatResponse = response.data.map((item) => {
        const date = dayjs(item.createdAt);
        const formattedDate = date.format("DD MMM YYYY");

        return {
          date: formattedDate,
          price: "₹ " + item.totalDiscountedPrice,
          qty: item.totalItem,
          status: capitalize(item.orderStatus),
          details: item._id,
        };
      });

      setRows(formatResponse);
    };

    getOrders();
  }, []);

  return (
    <div className="w-f px-20">
      {noOfOrders > 0 && (
        <div className="mt-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Your orders
          </h1>
        </div>
      )}

      <div className="flex flex-col space-y-5 mt-7">
        {noOfOrders > 0 ? (
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id == "details" ? (
                              <Button
                                sx={{
                                  bgcolor: "#4f46e5",
                                  color: "white",
                                  "&:hover": { bgcolor: "#3d35c6" },
                                }}
                                onClick={() =>
                                  navigate(`/track-order/${row.details}`)
                                }
                              >
                                See details
                              </Button>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="flex justify-center min-h-36 pt-6">
            <p className="text-gray-500 text-2xl font-semibold">
              No order has been placed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
