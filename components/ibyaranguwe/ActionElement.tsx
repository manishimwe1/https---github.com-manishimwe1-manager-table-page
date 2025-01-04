import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ActionElement = ({
  id,
  ndanguyeGute,
}: {
  id: Id<"product">;
  ndanguyeGute: "nishyuyeCash" | "mfasheIdeni" | "nishyuyeMake";
}) => {
  // const ClientWhoPaid = useQuery(api.clientName.getClientWhoPaidById, {
  //   //@ts-ignore
  //   id: id,
  // });

  const updatePayedClient = useMutation(api.clientName.updatePayedClient);
  //   function handleClick() {
  //     if (!ibyashize && id) {
  //       console.log("here", id);
  //       //@ts-ignore
  //       const clientId: Id<"client"> = id;
  //       updatePayedClient({ id: clientId });
  //     }
  //   }

  //   console.log(bishyuye);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ndanguyeGute === "mfasheIdeni" && (
          <DropdownMenuItem className="cursor-pointer">
            Ishyuye ideni
          </DropdownMenuItem>
        )}
        {ndanguyeGute === "nishyuyeMake" && (
          <DropdownMenuItem className="cursor-pointer">
            Ishyura asigaye
          </DropdownMenuItem>
        )}

        {/* <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 hover:bg-red-600 cursor-pointer w-full py-1 rounded-sm ">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Urabyemeza neza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Iki gikorwa ntigishobora gusubirwamo. Ibi birasiba iki
                  gicuruzwa muri stock
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex !flex-row !items-center justify-end space-x-3 w-full ">
                <AlertDialogCancel className=" !m-0">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-gray-200">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionElement;
