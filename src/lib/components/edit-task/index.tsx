import { Button } from "@/lib/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { ref, get, set, remove } from "firebase/database";
import { Calendar } from "@/lib/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import InviteBox from "../invite-box";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth"; // Import the auth module
import { auth } from "@/lib/firebaseConfig"; // Import your Firebase auth instance

interface TaskData {
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  description: string;
  assignedTo: string[];
  tags: string[];
}

interface OpenTaskProps {
  selectedTaskId: string | null;
  onTaskDeleted?: () => void;
}

export default function OpenTask({
  selectedTaskId,
  onTaskDeleted,
}: OpenTaskProps) {
  const [taskData, setTaskData] = React.useState<TaskData>({
    title: "",
    status: "",
    priority: "",
    dueDate: "",
    description: "",
    assignedTo: [],
    tags: [],
  });

  const [date, setDate] = React.useState<Date>();
  const [newAssignee, setNewAssignee] = React.useState("");
  const [userId, setUserId] = React.useState<string | null>(null); // State for user ID

  // Get project ID from the URL
  const pathname = usePathname();
  const projectId = pathname.split("/").pop(); // Extracting project ID from the URL

  // Fetch user ID
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID when authenticated
      } else {
        setUserId(null); // Reset user ID if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Fetch task data from Firebase
  React.useEffect(() => {
    if (projectId && selectedTaskId && userId) {
      fetchTaskData(projectId, selectedTaskId, userId);
    }
  }, [projectId, selectedTaskId, userId]);

  const fetchTaskData = async (
    projectId: string,
    taskId: string,
    userId: string
  ) => {
    try {
      const taskRef = ref(
        db,
        `users/${userId}/projects/${projectId}/tasks/${taskId}`
      );
      const snapshot = await get(taskRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTaskData(data);
        if (data.dueDate) {
          setDate(new Date(data.dueDate));
        }
      } else {
        console.log("No data available for the given task ID.");
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setTaskData((prevData) => ({ ...prevData, priority: value }));
  };

  const handleSaveChanges = async () => {
    if (!selectedTaskId || !userId) return;
    try {
      const taskRef = ref(
        db,
        `users/${userId}/projects/${projectId}/tasks/${selectedTaskId}`
      );
      await set(taskRef, {
        ...taskData,
        dueDate: date ? date.toISOString().split("T")[0] : null,
      });
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId || !userId) return;
    try {
      const taskRef = ref(
        db,
        `users/${userId}/projects/${projectId}/tasks/${selectedTaskId}`
      );
      await remove(taskRef);
      console.log("Task deleted successfully");
      if (onTaskDeleted) {
        onTaskDeleted(); // Notify parent component about the deletion
      }
      window.location.reload(); // Trigger a quick page refresh
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to handle adding a new assignee
  const handleAddAssignee = () => {
    if (newAssignee.trim() !== "") {
      setTaskData((prevData) => ({
        ...prevData,
        assignedTo: [...prevData.assignedTo, newAssignee.trim()],
      }));
      setNewAssignee("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className=""></button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="text-xs">Task/Detailed View</div>
        </SheetHeader>
        <div className="w-full py-6">
          <div className="w-full items-center">
            <input
              type="text"
              name="title"
              value={taskData.title || ""}
              onChange={handleInputChange}
              className="flex h-10 font-semibold w-full outline-none rounded-[10px] text-xl"
            />
          </div>
          <div className="w-full mt-4 flex gap-[4rem] items-center">
            <label className="text-[11px] flex items-center gap-2">
              <object
                className="w-[14px]"
                type="image/svg+xml"
                data={"/svg/status.svg"}
              ></object>
              Status
            </label>
            <p className="text-xs">{taskData.status}</p>
          </div>
          <div className="w-full mt-5 flex gap-[4rem] items-center">
            <label className="text-[11px] flex items-center gap-2">
              <object
                className="w-[14px]"
                type="image/svg+xml"
                data={"/svg/status.svg"}
              ></object>
              Priority
            </label>
            <Select onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[280px] h-[35px]">
                <SelectValue
                  placeholder={taskData.priority || "Change Priority"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full justify-between mt-5 flex  items-center">
            <label htmlFor="" className="text-[11px]  flex items-center gap-2">
              <object
                className="w-[13px]"
                type="image/svg+xml"
                data={"/svg/calender.svg"}
              ></object>
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[270px] text-xs h-[35px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span className="text-xs">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full mt-5 gap-[3rem]">
            <InviteBox
              newAssignee={newAssignee}
              setNewAssignee={setNewAssignee}
              handleAddAssignee={handleAddAssignee}
            />

            <div className="flex mt-2  items-center -space-x-4 w-full justify-end flex-row">
              {taskData.assignedTo.slice(0, 3).map((guest, index) => (
                <div
                  key={index}
                  className="w-[40px] flex flex-row items-center justify-center h-[40px] cursor-pointer border-solid border-[color:var(--primary-stroke)]
                inline-block rounded-full border-2 bg-white object-cover object-center hover:z-10 focus:z-10"
                >
                  <p className="text-sm text-[#808691]">
                    {guest.substring(0, 2).toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4 items-center">
            <label className="text-[11px] flex items-center gap-2">
              <object
                className="w-[16px]"
                type="image/svg+xml"
                data={"/svg/note.svg"}
              ></object>
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description || ""}
              onChange={handleInputChange}
              className="w-full pl-3 mt-3 bg-neutral-100 outline-none resize-none p-2 rounded-[8px] text-xs h-[100px]"
            ></textarea>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className="flex items-center gap-3">
              <Button
                variant={"outline"}
                className="text-xs"
                onClick={handleDeleteTask}
              >
                Delete Task
              </Button>
              <Button onClick={handleSaveChanges} className="text-xs">
                Save changes
              </Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
