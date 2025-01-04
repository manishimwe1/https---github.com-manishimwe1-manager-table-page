import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const DisplayBadge = ({
  value,
  ndanguyeGute,
  uzishyuraAngahe,
}: {
  value: string | number;
  ndanguyeGute: string;
  uzishyuraAngahe: number;
}) => {
  return (
    <div className="text-right">
      {" "}
      <Badge
        className={cn(
          "cursor-pointer text-stone-900 shadow-sm shadow-black/15 text-nowrap",
          ndanguyeGute === "nishyuyeCash" &&
            " bg-green-600 hover:bg-green-500 text-black -rotate-2 shadow-sm shadow-green-500",
          ndanguyeGute === "mfasheIdeni" &&
            " bg-red-600 hover:bg-red-500 text-black rotate-2 shadow-sm shadow-red-500",
          ndanguyeGute === "nishyuyeMake" &&
            " bg-blue-600 hover:bg-blue-500 text- shadow-sm shadow-blue-500"
        )}
      >
        {ndanguyeGute === "nishyuyeCash" && (
          <span className="text-nowrap">
            Nishyuye {value.toLocaleString()} Rwf
          </span>
        )}

        {ndanguyeGute === "mfasheIdeni" && (
          <span className="text-nowrap">
            hasigaye {value.toLocaleString()} Rwf
          </span>
        )}
        {ndanguyeGute === "nishyuyeMake" && (
          <span className="text-nowrap">
            Nsigajemo {uzishyuraAngahe.toLocaleString()} Rwf
          </span>
        )}
      </Badge>
    </div>
  );
};

export default DisplayBadge;
