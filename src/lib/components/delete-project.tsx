import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebaseConfig";
import { ref, remove } from "firebase/database";

export default function DeleteProjects() {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter(); // Initialize the router for navigation

  const handleDelete = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const projectId = pathname.split("/").pop(); // Get the project ID from the URL
        const userId = user.uid;
        const projectRef = ref(db, `users/${userId}/projects/${projectId}`);

        // Delete the project from the database
        remove(projectRef)
          .then(() => {
            console.log("Project deleted successfully");
            router.push("/home"); // Redirect to the /home page
          })
          .catch((error) => {
            console.error("Error deleting project:", error);
          });
      } else {
        console.log("No user is signed in.");
      }
    });
  };

  return (
    <Button className="w-[108px] h-[40px] text-xs " onClick={handleDelete}>
      Delete Project
    </Button>
  );
}
