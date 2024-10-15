import * as React from "react";
import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { Icons } from "@/lib/components/icons/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import InviteComponent from "../invite-me";

export default function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [startDate] = useState(new Date());

  // Get the project ID from the URL
  const pathname = usePathname();
  const projectId = pathname.split("/").pop();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get the current authenticated user
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the user ID
      const userEmail = user.email || ""; // Get the user's email

      // Add the user's email to the assignedTo array
      const updatedAssignedTo = [userEmail, ...assignedTo];

      const newTask = {
        title,
        description,
        category,
        dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        status: "newRequest",
        priority,
        assignedTo: updatedAssignedTo,
        startDate: format(startDate, "yyyy-MM-dd"),
        imageUrl: "",
        fileUrl: "",
      };

      try {
        const taskRef = ref(db, `users/${userId}/projects/${projectId}/tasks`);
        await push(taskRef, newTask);
        console.log("Task created successfully!");
      } catch (error) {
        console.error("Error creating task: ", error);
      } finally {
        setIsLoading(false);
        window.location.reload();
      }
    } else {
      console.error("User not authenticated");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <div className="h-[42px] cursor-pointer w-full flex flex-row items-center justify-center rounded-[10px] bg-white">
            <object
              className="w-[20px]"
              type="image/svg+xml"
              data={"/svg/plus.svg"}
            ></object>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center mb-5 gap-2">
              <div className="border border-solid border-[color:var(--primary-stroke)] flex flex-row items-center justify-center w-[38px] h-[38px] rounded-[100%]">
                <object
                  className="w-[18px]"
                  type="image/svg+xml"
                  data={"/svg/pin.svg"}
                ></object>
              </div>
              Create New Task
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <form onSubmit={handleSubmit} className="block">
              <div>
                <label
                  className="mb-2 text-xs text-black block"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="w-full outline-none pl-2 placeholder:text-xs border border-solid border-[color:var(--primary-stroke)] rounded-[8px] text-[13px] h-[40px]"
                  type="text"
                  placeholder="Enter title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label
                  className="mb-2 text-xs text-black block"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter task description..."
                  name="description"
                  id="description"
                  className="w-full outline-none resize-none p-2 placeholder:text-xs border border-solid border-[color:var(--primary-stroke)] rounded-[8px] text-[13px] h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex mt-4 gap-2 w-full flex-row items-center">
                <div className="w-full">
                  <label
                    className="mb-2 text-xs text-black block"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <Select onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Human Resources">
                        Human Resources
                      </SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Customer Support">
                        Customer Support
                      </SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Strategy">Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <label
                    className="mb-2 text-xs text-black block"
                    htmlFor="priority"
                  >
                    Priority
                  </label>
                  <Select onValueChange={(value) => setPriority(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <label
                  className="mb-2 text-xs text-black block"
                  htmlFor="dueDate"
                >
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-xs text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "PPP")
                      ) : (
                        <span className="text-xs">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="mt-6">
                <InviteComponent setAssignedTo={setAssignedTo} />
              </div>

              <Button
                type="submit"
                className="mt-4 text-xs h-[40px] w-[120px]"
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
