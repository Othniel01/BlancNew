"use client";
import { useRef } from "react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/lib/components/ui/button";
import { Checkbox } from "@/lib/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,

  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { DataTableToolbar } from "@/lib/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/lib/components/data-table/data-table-pagination";

import { usePathname } from "next/navigation";

// Firebase imports
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebaseConfig"; // Assuming Firebase is initialized in this path
import { getAuth, onAuthStateChanged } from "firebase/auth";
import OpenTask from "../edit-task";

export type Task = {
  id: string;
  category: string;
  title: string;
  status: "todo" | "In Progress" | "backlog" | "done" | "cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";
};

// Column definitions
export const columns = (
  handleOpenTask: (taskId: string) => void
): ColumnDef<Task>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize border border-solid border-[color:var(--primary-stroke)] rounded-[8px] text-xs w-fit p-2 font-semibold">
        {row.getValue("category")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const taskId = row.original.id;
      return (
        <>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={() => handleOpenTask(taskId)}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </>
      );
    },
  },
];

export function TaskTable() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
    null
  );

  const pathname = usePathname();
  const projectId = pathname.split("/").pop(); // Extract the project ID from the URL
  const [userId, setUserId] = React.useState<string | null>(null);
  const openTaskRef = useRef<HTMLDivElement>(null);

  // Handle task opening
  const handleOpenTask = (taskId: string) => {
    setSelectedTaskId(taskId); // Store the clicked task ID
    console.log("handleOpenTask called for task ID:", taskId);

    if (openTaskRef.current) {
      console.log("openTaskRef is valid:", openTaskRef.current);

      // Find the button inside the div
      const button = openTaskRef.current.querySelector("button");

      if (button) {
        console.log("Button found:", button);
        button.click(); // Simulate the click on the button
      } else {
        console.log("Button not found inside openTaskRef");
      }
    } else {
      console.log("openTaskRef is null");
    }
  };

  // Get the user ID
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  React.useEffect(() => {
    if (!projectId || !userId) return; // Ensure projectId and userId are available

    const tasksRef = ref(db, `users/${userId}/projects/${projectId}/tasks`);

    // Fetch tasks from Firebase
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fetchedTasks: Task[] = [];

        for (const key in data) {
          fetchedTasks.push({ id: key, ...data[key] });
        }

        setTasks(fetchedTasks); // Update state with fetched tasks
      } else {
        setTasks([]); // No tasks found
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [projectId, userId]); // Add userId as a dependency

  const table = useReactTable({
    data: tasks, // Use the fetched tasks here
    columns: columns(handleOpenTask),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full pl-[2rem] pb-[2rem] pr-[2rem] ">
      <div className="flex items-center py-4">
        <DataTableToolbar table={table} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto text-xs h-[35px] rounded-[10px]"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md w-full   border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-full ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="w-full "
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedTaskId(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="w-full ">
                <TableCell colSpan={100} className="h-25 w-full  text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center  justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
        <div ref={openTaskRef}>
          <OpenTask selectedTaskId={selectedTaskId} />
        </div>
      </div>
    </div>
  );
}
