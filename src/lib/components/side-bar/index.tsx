"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { signOut } from "firebase/auth"; // Import Firebase signOut
import { auth } from "@/lib/firebaseConfig"; // Import your Firebase auth instance

export default function Sidebar() {
  const router = useRouter();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="sideBar flex-shrink-0 w-[200px] h-full bg-[#ffff] z-10 fixed left-0 top-[50px] pt-[3rem] pl-[1.5rem] pr-[0.5rem] border-r border-solid border-r-[color:var(--primary-stroke)]">
      <div className="sideBarCluster">
        <h1 className="text-[10px] font-normal">PROJECTS</h1>

        <Link href={"./home"}>
          <div className="menuSelection mt-4">
            <object
              className="w-[12px]"
              type="image/svg+xml"
              data={"/svg/dashboard.svg"}
            ></object>
            <p className="text-xs">Boards</p>
          </div>
        </Link>

        {/* <div className="menuSelection">
          <object
            className="w-[17px]"
            type="image/svg+xml"
            data={"/svg/teams.svg"}
          ></object>
          <p className="text-xs">Teams</p>
        </div>

        <div className="menuSelection">
          <object
            className="w-[17px]"
            type="image/svg+xml"
            data={"/svg/teams.svg"}
          ></object>
          <p className="text-xs">Analytics</p>
        </div> */}
      </div>

      <div className="lineDivide w-full h-[1px] bg-[color:var(--primary-stroke)] mt-[3rem]"></div>

      <div className="sideBarCluster mt-[3rem]">
        <h1 className="text-[10px] font-normal">GENERAL</h1>
        {/* <Link href={"./sign-up"}>
          <div className="menuSelection mt-4">
            <object
              className="w-[17px]"
              type="image/svg+xml"
              data={"/svg/settings.svg"}
            ></object>
            <p className="text-xs">Settings</p>
          </div>
        </Link> */}

        {/* Logout Button */}
        <div
          className="menuSelection mt-4 cursor-pointer"
          onClick={handleLogout}
        >
          <object
            className="w-[17px]"
            type="image/svg+xml"
            data={"/svg/logout.svg"} // Use a logout icon
          ></object>
          <p className="text-xs">Logout</p>
        </div>
      </div>
    </div>
  );
}
