"use client";

import React from "react";
import Image from "next/image";
import Sidebar from "@/lib/components/side-bar";
import Link from "next/link";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/lib/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";

interface MainLayoutProps {
  children?: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-full h-full">
      <div className="placeHolderTop bg-[#ffff] h-[58px] border-b border-solid border-b-[color:var(--primary-stroke)]"></div>
      <div className="w-full border-b border-solid border-b-[color:var(--primary-stroke)] h-[58px] pl-[3rem] pr-[3rem] items-center bg-[#ffff]  top-0 fixed flex flex-row z-20 justify-between ">
        <div className="logo flex items-center flex-row gap-2 w-[20px] h-[20px]">
          <Image
            src={"/images/blanc-logo.png"}
            alt="Cover Image"
            className="h-[20px] w-[20px] object-cover"
            width={740}
            height={740}
          />
          <h1 className="font-light text-base">
            blanc<span className="font-bold">Board</span>
          </h1>
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="searchBar mt-2 h-[35px] w-[240px] bg-[#f0f0f3] pl-[.8rem] pr-[.8rem]  flex  rounded-[10px] ">
              <div className="w-full flex flex-row justify-between items-center  h-full">
                <p className="text-xs text-neutral-500">Search...</p>
                <div className="bg-white flex items-center text-[10px] rounded-md p-[.3rem]">
                  <object
                    className="w-[17px]"
                    type="image/svg+xml"
                    data={"/svg/command.svg"}
                  ></object>
                  Ctrlk
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Navigation">
                  <Link href={"./home"} className="cursor-pointer">
                    <CommandItem>
                      Boards
                      <CommandShortcut>dr</CommandShortcut>
                    </CommandItem>
                  </Link>

                  {/* <CommandItem>
                    Teams
                    <CommandShortcut>dr</CommandShortcut>
                  </CommandItem>
                  <CommandItem>Settings</CommandItem> */}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full h-full flex flex-row items-center">
        <div className="placeholdersidebar flex-shrink-0 bg-[#b91818]  w-[200px] h-full border-r border-solid border-r-[color:var(--primary-stroke)]  "></div>
        <div className="contentArea  w-full h-full">{children}</div>
      </div>
      <Sidebar />
    </div>
  );
}

export default MainLayout;
