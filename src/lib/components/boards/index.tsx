import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SkeletonLoader from "../skeleton-loader"; // Adjust the path accordingly

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  dueDate: string;
}

const Boards = () => {
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const projectsRef = ref(db, `users/${userId}/projects`);

        // Listen for value changes in the user's projects
        const unsubscribeProjects = onValue(
          projectsRef,
          (snapshot) => {
            const projects: Project[] = [];
            snapshot.forEach((childSnapshot) => {
              const project = childSnapshot.val();
              projects.push({ id: childSnapshot.key, ...project });
            });
            setProjectData(projects);
            setLoading(false); // Set loading to false once data is fetched
          },
          (error) => {
            console.error("Error fetching projects:", error);
            setLoading(false); // Stop loading even if there's an error
          }
        );

        // Cleanup function for the projects listener
        return () => unsubscribeProjects();
      } else {
        console.log("No user is signed in.");
        setProjectData([]); // Clear project data if the user is not signed in
        setLoading(false); // Stop loading if no user is signed in
      }
    });

    // Cleanup function for the authentication listener
    return () => unsubscribeAuth();
  }, []);

  // Function to limit the number of words in a text
  const limitWords = (text: string, limit: number): string => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  if (loading) {
    return (
      <div className="flex gap-4 ">
        {/* Render skeleton loaders while loading */}
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      {projectData.length > 0 ? (
        projectData.map((project) => (
          <Link key={project.id} href={`/${project.id}`}>
            <div className="bg-[#ffff] active:scale-[.98] p-4 pl-5 relative w-[290px] h-[180px] rounded-[14px]">
              <div className="cursor-pointer absolute top-4 right-3">
                <object
                  className="w-[24px]"
                  type="image/svg+xml"
                  data={"/svg/more.svg"}
                ></object>
              </div>

              <p className="p-1 pl-2 pr-2 text-[10px] rounded-[30px] text-white w-fit h-fit bg-black">
                {project.category}
              </p>
              <h1 className="font-semibold text-sm mt-2">{project.title}</h1>
              <p className="text-[11px] w-[80%] mt-1 text-[#808691]">
                {limitWords(project.description, 10)}
              </p>

              <div className="h-[1px] absolute bottom-[3.5rem] left-0 w-full bg-[color:var(--primary-stroke)]"></div>

              <div className="flex absolute left-0 pl-3 pr-3 bottom-0 items-center justify-between w-full h-[60px] flex-row">
                <p className="p-1 pl-2 pr-2 text-[11px] rounded-[30px] w-fit h-fit bg-[#f5f5f6]">
                  {project.dueDate}
                </p>
                <object
                  className="w-[13px] mr-1"
                  type="image/svg+xml"
                  data={"/svg/rightarrow.svg"}
                ></object>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p></p>
      )}
    </>
  );
};

export default Boards;
