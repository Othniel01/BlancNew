import React from "react";

// Define an interface for the props
interface InviteBoxProps {
  newAssignee: string; // Assuming newAssignee is a string
  setNewAssignee: React.Dispatch<React.SetStateAction<string>>; // State updater function
  handleAddAssignee: () => void; // Function type with no parameters
}

const InviteBox: React.FC<InviteBoxProps> = ({
  newAssignee,
  setNewAssignee,
  handleAddAssignee,
}) => {
  return (
    <div className="w-full mt-4 gap-[3rem]">
      <div className="flex items-center gap-[3rem]">
        <label htmlFor="" className="text-[11px] flex items-center gap-2">
          <object
            className="w-[13px]"
            type="image/svg+xml"
            data={"/svg/teams.svg"}
          ></object>
          Assignee
        </label>

        <div className="w-full mt-3 flex items-center bg-neutral-100 outline-none resize-none p-2 rounded-[8px]">
          <input
            type="text"
            className="w-full bg-transparent outline-none h-[22px] border-none text-xs"
            value={newAssignee} // Bind input value to newAssignee state
            onChange={(e) => setNewAssignee(e.target.value)} // Update state on input change
          />
          <div
            className="w-[70px] cursor-pointer text-xs flex flex-row items-center justify-center bg-[#ffffff] text-[#a0a7b1] rounded-[5px] h-[20px]"
            onClick={handleAddAssignee} // Call the handler on click
          >
            Invite
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteBox;
