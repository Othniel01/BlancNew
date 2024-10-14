import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/components/ui/sheet";

export default function EditSheet() {
  return (
    <>
      <Sheet>
        <SheetTrigger>Hello</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Recent Activity</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
