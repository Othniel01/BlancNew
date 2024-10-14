"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { ref, onValue, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import { usePathname } from "next/navigation";

import TaskForm from "../task-form";
import OpenTask from "../edit-task";
// import OpenTask from "../edit-task";

// Define the shape of a task
interface Task {
  id: string; // Use string for Firebase keys
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  fileUrl: string;
  priority: string;
  startDate: string;
  dueDate: string;
  assignedTo: string[];
  status: string;
}

// Define the shape of your columns
interface Columns {
  newRequest: Task[];
  inProgress: Task[];
  completed: Task[];
  cancelled: Task[];
  backlog: Task[];
}

function DraggableBox({
  task,
  onOpenTask,
}: {
  task: Task;
  onOpenTask: (taskId: string) => void;
}) {
  const [isOverMoreButton, setIsOverMoreButton] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    disabled: isOverMoreButton,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-full h-fit pb-16 bg-white rounded-[14px] relative p-4 pl-5"
    >
      {" "}
      <div
        className="cursor-pointer absolute top-4 right-3 "
        onMouseEnter={() => setIsOverMoreButton(true)}
        onMouseLeave={() => setIsOverMoreButton(false)}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          console.log("Clicked on more icon for task ID:", task.id);
          onOpenTask(task.id); // Call the handler to simulate the click
        }}
      >
        <object
          className="w-[22px]"
          type="image/svg+xml"
          data={"/svg/more.svg"}
        ></object>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <p className="p-1 pl-2 pr-2 text-[11px] rounded-[30px] bg-black text-white w-fit h-fit">
          {task.category}
        </p>
      </div>
      <h1 className="font-semibold w-[80%] text-base mt-2">{task.title}</h1>
      <p className="text-[12px] w-[80%] mt-1 text-[#808691]">
        {task.description}
      </p>
      <hr className="w-full mt-4 h-[1px] bg-[#e4e6f0]" />
      <div className="flex items-center -space-x-4 absolute left-5 bottom-3 flex-row">
        {task.assignedTo.slice(0, 3).map((guest, index) => (
          <div
            key={index}
            className="w-[40px] flex flex-row items-center justify-center h-[40px] cursor-pointer border-solid border-[color:var(--primary-stroke)]
            inline-block  rounded-full border-2 bg-white object-cover object-center hover:z-10 focus:z-10
            "
          >
            <p className="text-sm text-[#808691]">
              {guest.substring(0, 2).toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DroppableContainer({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? "" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="container flex flex-col gap-4 mt-4 w-full h-[700px]"
    >
      {children}
    </div>
  );
}

export default function Kanban() {
  const pathname = usePathname(); // Get the current path
  const projectId = pathname.split("/").pop();
  const [columns, setColumns] = useState<Columns>({
    newRequest: [],
    inProgress: [],
    completed: [],
    cancelled: [],
    backlog: [],
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Create a ref for the OpenTask component
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

  // Handle authentication and task fetching
  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && projectId) {
        const userId = user.uid;
        const tasksRef = ref(db, `users/${userId}/projects/${projectId}/tasks`);

        // Fetch tasks from Firebase
        onValue(tasksRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const fetchedTasks: Task[] = [];

            for (const key in data) {
              fetchedTasks.push({ id: key, ...data[key] });
            }

            // Organize tasks into columns
            const newColumns: Columns = {
              newRequest: fetchedTasks.filter(
                (task) => task.status === "newRequest"
              ),
              inProgress: fetchedTasks.filter(
                (task) => task.status === "inProgress"
              ),
              completed: fetchedTasks.filter(
                (task) => task.status === "completed"
              ),
              cancelled: fetchedTasks.filter(
                (task) => task.status === "cancelled"
              ),
              backlog: fetchedTasks.filter((task) => task.status === "backlog"),
            };
            setColumns(newColumns);
          } else {
            console.log("No tasks found");
          }
        });
      }
    });

    return () => unsubscribeAuth();
  }, [projectId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromColumn = Object.keys(columns).find((key) =>
      columns[key as keyof Columns].some(
        (task) => task.id === active.id.toString()
      )
    );

    const toColumn = over.id as keyof Columns;

    if (fromColumn && fromColumn !== toColumn) {
      const draggedTask = columns[fromColumn as keyof Columns].find(
        (task) => task.id === active.id.toString()
      );

      if (draggedTask) {
        setColumns((prevColumns) => {
          const updatedColumns = {
            ...prevColumns,
            [fromColumn]: prevColumns[fromColumn as keyof Columns].filter(
              (task) => task.id !== active.id.toString()
            ),
            [toColumn]: [
              ...prevColumns[toColumn],
              { ...draggedTask, status: toColumn },
            ],
          };

          const userId = getAuth().currentUser?.uid;

          if (userId && projectId) {
            const taskRef = ref(
              db,
              `users/${userId}/projects/${projectId}/tasks/${draggedTask.id}`
            );
            update(taskRef, { status: toColumn });
          }

          return updatedColumns;
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full pl-8">
        {/* <OpenTask /> */}
        <div className="kanban-roles pb-80 overflow-y-hidden overflow-x-auto gap-5 h-fit flex flex-row items-center">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <div key={columnId} className="box h-full flex-shrink-0 w-[280px]">
              <div className="mb-4 flex flex-row items-center justify-between">
                <div className="flex flex-row w-full items-center gap-2">
                  <div
                    className={`rounded-full h-[10px] w-[10px] ${
                      columnId === "newRequest"
                        ? "bg-red-500"
                        : columnId === "inProgress"
                        ? "bg-[#e3e63e]"
                        : columnId === "completed"
                        ? "bg-[#2db5a7]"
                        : columnId === "backlog"
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="flex justify-between w-full flex-row items-center">
                    <h1 className="text-xs font-semibold capitalize">
                      {columnId}
                    </h1>

                    <div className="flex items-center gap-3">
                      <p className="text-xs text-[#808691] ">
                        {tasks.length} Tasks
                      </p>

                      <div className="cursor-pointer ">
                        {/* <object
                          className="w-[20px] cursor-pointer"
                          type="image/svg+xml"
                          data={"/svg/more.svg"}
                        ></object> */}
                        <div className="" ref={openTaskRef}>
                          <OpenTask selectedTaskId={selectedTaskId} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[42px] cursor-pointer flex flex-row items-center justify-center rounded-[10px] w-full">
                <TaskForm />
              </div>

              <DroppableContainer id={columnId}>
                {tasks.map((task: Task) => (
                  <DraggableBox
                    key={task.id}
                    task={task}
                    onOpenTask={handleOpenTask}
                  />
                ))}
              </DroppableContainer>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
