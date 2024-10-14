"use client";

import * as React from "react";
import { useState } from "react";
import { MainLayout } from "@/lib/components/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { Icons } from "@/lib/components/icons/icons";
import { DialogDescription } from "@radix-ui/react-dialog";
import { db } from "@/lib/firebaseConfig"; // Firebase config for Realtime DB
import { ref, set } from "firebase/database"; // Firebase Realtime Database methods
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import Boards from "@/lib/components/boards";
import InviteComponent from "@/lib/components/invite-me";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    assignedTo: [],
    tasks: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  // Handle form input changes
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category: any) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  // Handle email assignment from InviteComponent
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  // Handle date selection and update formData
  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      dueDate: format(selectedDate, "yyyy-MM-dd"), // Store the formatted date
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true); // Start loading animation

    const auth = getAuth(); // Get the current authenticated user
    const user = auth.currentUser; // Get the current user

    if (!user) {
      console.error("No user is signed in.");
      setIsLoading(false);
      return;
    }

    const userId = user.uid; // Extract the user ID
    console.log("Creating project for User ID:", userId); // Log the user ID

    const newProject = {
      id: Date.now(), // Simple way to generate an ID
      link: `/project-${Date.now()}`, // Dynamic project link
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: new Date().toLocaleDateString(), // Start date
      dueDate: formData.dueDate,
      assignedTo,
      tasks: {},
    };

    try {
      // Save project to Firebase Realtime Database
      const projectRef = ref(db, `users/${userId}/projects/${newProject.id}`);
      await set(projectRef, newProject);
      console.log("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project: ", error);
    } finally {
      setIsLoading(false); // Stop loading animation
      window.location.reload(); // Refresh the page
    }
  };

  return (
    <MainLayout>
      <div className=" h-full w-full">
        <div className="w-full grid grid-cols-[repeat(3,0.1fr)] h-full p-8 relative pt-[4.5rem] gap-8">
          <div className=" absolute left-[2rem] top-[15px]">
            <Dialog>
              <DialogTrigger className="w-full ">
                <div className="createNewProject active:scale-[.9] hover:bg-[#ffffff9c] w-[110px] h-[35px] rounded-[10px] bg-[#ffff] border border-solid border-[color:var(--primary-stroke)] cursor-pointer flex items-center justify-evenly text-[10px] text-black">
                  <object
                    className="w-[17px]"
                    type="image/svg+xml"
                    data={"/svg/add.svg"}
                  ></object>
                  New Project
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex flex-row items-center mb-5 gap-2">
                    <div className="border border-solid border-[color:var(--primary-stroke)] flex flex-row items-center justify-center w-[38px] h-[38px] rounded-[100%] ">
                      <object
                        className="w-[18px]"
                        type="image/svg+xml"
                        data={"/svg/pin.svg"}
                      ></object>
                    </div>
                    Create New Project
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                  <form onSubmit={handleSubmit}>
                    <div className="">
                      <label
                        className="mb-2 text-xs text-black block"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <input
                        className="w-full outline-none  pl-2 placeholder:text-xs border border-solid border-[color:var(--primary-stroke)] rounded-[8px] text-[13px] h-[40px]"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="mt-4">
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
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full outline-none resize-none p-2 placeholder:text-xs border border-solid border-[color:var(--primary-stroke)] rounded-[8px] text-[13px] h-[100px]"
                      ></textarea>
                    </div>

                    <div className="flex gap-4 mt-4 flex-row">
                      <div className="w-full">
                        <label
                          className="mb-2 text-xs text-black block"
                          htmlFor="category"
                        >
                          Category
                        </label>
                        <Select onValueChange={handleCategoryChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pick Me" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Development">
                              Development
                            </SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">
                              Operations
                            </SelectItem>
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
                          htmlFor="dueDate"
                        >
                          Due Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start  text-xs text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2  h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span className="text-xs">Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto  p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange} // Update to handleDateChange
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* InviteComponent now returns the selected emails */}
                      <InviteComponent setAssignedTo={setAssignedTo} />
                    </div>

                    <Button
                      type="submit"
                      className="mt-4 text-xs h-[40px] w-[120px]"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Icons.spinner className="mr-2  h-4 w-4 animate-spin" />
                      )}
                      Create
                    </Button>

                    {/* <button
                      className="mt-7 flex items-center justify-center h-[40px] w-[120px] bg-black text-white text-xs p-2 rounded-[10px]"
                      type="submit"
                    >
                      Create
                    </button> */}
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <Boards />
        </div>
      </div>
    </MainLayout>
  );
}
