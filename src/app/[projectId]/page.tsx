"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/lib/components/ui/sheet";
import { MainLayout } from "@/lib/components/layout";
import Kanban from "@/lib/components/kanban";
import { TaskTable } from "@/lib/components/data-table/data-table";
import OpenTask from "@/lib/components/edit-task";
import SkeletonLoader from "@/lib/components/skeleton-loader-text";
import DeleteProjects from "@/lib/components/delete-project";

const ProjectOne = () => {
  const { projectId } = useParams(); // Get the projectId from the URL
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  const [projectDescription, setProjectDescription] = useState<string | null>(
    null
  );

  const [activeMenu, setActiveMenu] = useState<"kanban" | "table">("kanban");

  useEffect(() => {
    const auth = getAuth();

    // Handle authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && projectId) {
        const userId = user.uid; // Get the user ID
        const projectRef = ref(db, `users/${userId}/projects/${projectId}`);

        // Fetch the project data from Firebase
        const unsubscribeProject = onValue(projectRef, (snapshot) => {
          const projectData = snapshot.val();
          if (projectData) {
            setProjectTitle(projectData.title);
            setProjectDescription(projectData.description); // Set the project title from Firebase
          } else {
            setProjectTitle("Project Not Found");
            setProjectDescription("Project not Found");
          }
        });

        // Cleanup the project subscription when component unmounts or user changes
        return () => unsubscribeProject();
      } else {
        setProjectTitle("User not authenticated");
      }
    });

    // Cleanup the authentication subscription when component unmounts
    return () => unsubscribeAuth();
  }, [projectId]);

  return (
    <MainLayout>
      <div className="w-full h-full">
        <div className="detailBar bg-[#ffff] w-full h-[100px] relative pl-[2rem] pt-[0.8rem] border-b border-solid border-b-[color:var(--primary-stroke)]">
          {/* Display projectTitle or loading state */}
          <h1 className="text-base gap-2 flex items-center font-semibold">
            {projectTitle ? projectTitle : <SkeletonLoader />}
          </h1>

          <h1 className="text-xs w-[600px] mt-1">
            {projectDescription ? projectDescription : <SkeletonLoader />}
          </h1>

          <div className="select-container gap-8 absolute bottom-4 right-10 flex flex-row items-center text-[14px]">
            {/* <Sheet>
              <SheetTrigger>
                <p className="cursor-pointer text-xs">Timeline</p>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Recent Activity</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet> */}

            {/* <p className="text-xs cursor-pointer">Discussions</p> */}
            <OpenTask selectedTaskId={null} />

            <DeleteProjects />
          </div>
        </div>

        <div className="p-8 relative w-full">
          <div className="flex flex-row gap-4 items-center">
            <div
              className={`p-2 flex items-center gap-2 cursor-pointer text-xs pl-3 pr-3 rounded-[10px] ${
                activeMenu === "kanban" ? "bg-[#e4e6f0]" : ""
              }`}
              onClick={() => setActiveMenu("kanban")}
            >
              <object
                className="w-[15px]"
                type="image/svg+xml"
                data={"/svg/kanban.svg"}
              ></object>
              <p>Kanban</p>
            </div>
            <div
              className={`p-2 flex items-center gap-2 cursor-pointer text-xs pl-3 pr-3 rounded-[10px] ${
                activeMenu === "table" ? "bg-[#e4e6f0]" : ""
              }`}
              onClick={() => setActiveMenu("table")}
            >
              <object
                className="w-[19px]"
                type="image/svg+xml"
                data={"/svg/table.svg"}
              ></object>
              <p>Table</p>
            </div>
          </div>
          <hr className="w-full mt-4 h-[1.5px] bg-[#e4e6f0]" />
        </div>

        {/* Conditionally render the components based on activeMenu */}
        {activeMenu === "kanban" && <Kanban />}
        {activeMenu === "table" && <TaskTable />}
      </div>
    </MainLayout>
  );
};

export default ProjectOne;
