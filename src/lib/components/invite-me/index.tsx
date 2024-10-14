import Image from "next/image";
import { useState } from "react";

// Define the structure of a user object
interface User {
  email: string;
  profilePicture: string | null;
  initials: string | null;
}

interface InviteComponentProps {
  setAssignedTo: (users: string[]) => void; // Function to update assignedTo in the parent component
}

// Function to fetch Gmail profile picture using Google People API
async function getGoogleProfilePicture(email: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Your API key
  const url = `https://people.googleapis.com/v1/people:searchContacts?query=${email}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch profile picture");
    }

    const data = await response.json();
    const person = data.results?.[0]?.person;
    const pictureUrl = person?.photos?.[0]?.url;

    return pictureUrl || null; // Return null if no picture found
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
}

export default function InviteComponent({
  setAssignedTo,
}: InviteComponentProps) {
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  // Function to fetch Gmail profile picture
  const fetchGmailProfilePicture = async (
    email: string
  ): Promise<string | null> => {
    const pictureUrl = await getGoogleProfilePicture(email);
    return pictureUrl || null; // Return null if no picture found
  };

  // Function to get initials from email
  const getInitials = (email: string): string => {
    const namePart = email.split("@")[0];
    const initials = namePart
      .split(".")
      .map((n) => n[0].toUpperCase())
      .join("");
    return initials;
  };

  const handleInvite = async () => {
    const emailInput = document.getElementById(
      "email-input"
    ) as HTMLInputElement | null;
    const email = emailInput?.value;

    if (!email) return;

    // Fetch the profile picture or generate initials
    const profilePicture = await fetchGmailProfilePicture(email);
    const user: User = {
      email,
      profilePicture,
      initials: profilePicture ? null : getInitials(email),
    };

    const newAssignedUsers = [...assignedUsers, user];
    setAssignedUsers(newAssignedUsers);

    // Update the parent component with the assigned emails
    setAssignedTo(newAssignedUsers.map((user) => user.email));
  };

  return (
    <div className="mt-6">
      <label className="mb-2 text-xs text-black block" htmlFor="description">
        Assign to
      </label>
      <div className="w-full flex flex-row items-center pr-2 border border-solid border-[color:var(--primary-stroke)] text-[13px] rounded-[8px] h-[40px]">
        <input
          id="email-input"
          className="w-full placeholder:text-xs text-[13px] h-full outline-none pl-2"
          type="text"
          placeholder="Enter name or email..."
        />
        <div
          className="w-[70px] cursor-pointer text-xs flex flex-row items-center justify-center bg-[#f5f5f6] text-[#a0a7b1] rounded-[5px] h-[70%]"
          onClick={handleInvite}
        >
          Invite
        </div>
      </div>

      <div className="flex items-center -space-x-4 mt-3">
        {assignedUsers.map((user, index) => (
          <div
            key={index}
            className="w-[40px] flex flex-row items-center justify-center h-[40px] cursor-pointer border-solid border-[color:var(--primary-stroke)]
            inline-block  rounded-full border-2 bg-white object-cover object-center hover:z-10 focus:z-10
            "
          >
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.email}
                className="w-full h-full rounded-full"
              />
            ) : (
              <p className="text-sm text-[#808691]">{user.initials}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
