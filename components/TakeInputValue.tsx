import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { useClientInfoStore } from "@/lib/store/zustand";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Input } from "./ui/input";

const TakeInputValue = ({
  setActiveRow,
  productType,
  id,
  ukonyigurishaKuriDetail,
  byoseHamwe,
  ingano,
  igicuruzwa,
  loading,
  data,
  ayomazeGucuruza,
}: {
  id: Id<"product">;
  setActiveRow: Dispatch<SetStateAction<boolean>>;
  productType: string;
  ukonyigurishaKuriDetail: number;
  data: ProductType[] | undefined;
  byoseHamwe: number;
  ingano: number;
  igicuruzwa: string;
  loading: boolean;
  ayomazeGucuruza: number;
}) => {
  const session = useSession();
  const userId = session.data?.user;
  const { toast } = useToast();
  const user = useQuery(api.user.getUserIndb, { email: userId?.email || "" });

  const [localInputValue, setLocalInputValue] = useState<string>("");
  const [localCalculatedValue, setLocalCalculatedValue] = useState<number>(0);

  const { name, updateProduct, productData, addProduct, removeProduct } =
    useClientInfoStore();

  const MAX_VALUE = data?.find((product) => product._id === id)?.byoseHamwe;

  useEffect(() => {
    if (loading === true) {
      setLocalInputValue("");
      setLocalCalculatedValue(0);
    }
  }, [loading]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setLocalInputValue(newValue);
      setLocalCalculatedValue(Number(newValue) * ukonyigurishaKuriDetail);
      setActiveRow(true);
    },
    [setActiveRow, ukonyigurishaKuriDetail, name, toast]
  );

  const handleBlur = useCallback(() => {
    if (
      !ukonyigurishaKuriDetail ||
      name === "" ||
      Number(localInputValue) <= 0
    ) {
      toast({
        description: "Shyiramo izina ry'umukiriya cg atwaye zingahe",
        variant: "destructive",
      });
      setLocalInputValue("");
      productData.find((product) => {
        if (product.productId === id) {
          removeProduct(product.productId);
        }
      });
      return;
    }
    if (MAX_VALUE) {
      if (Number(localInputValue) > MAX_VALUE) {
        toast({
          description: " Ooops!!... ibyo atwaye biruta ibiri muri stock ",
          variant: "destructive",
        });
        setLocalInputValue("");
        productData.find((product) => {
          if (product.productId === id) {
            removeProduct(product.productId);
          }
        });
        return;
      }
    }
    const total = Number(localInputValue) * ukonyigurishaKuriDetail;

    const fields = {
      aratwaraZingahe: Number(localInputValue),
      yishyuyeAngahe: total,
    };

    const existingProduct = productData.find(
      (product) => product.productId === id
    );

    if (existingProduct) {
      console.log("existingProduct", existingProduct);

      updateProduct(id, fields);
    }
    addProduct({
      productId: id,
      byoseHamwe,
      productType,
      ingano,
      aratwaraZingahe: Number(localInputValue),
      yishyuyeAngahe: total,
      igicuruzwa,
      ukonyigurishaKuriDetail,
      userId: user?._id as Id<"user">,
      ayomazeGucuruza,
    });
  }, [
    localInputValue,
    ukonyigurishaKuriDetail,
    name,
    addProduct,
    id,
    byoseHamwe,
    productType,
    ingano,
    igicuruzwa,
    user?._id,
    toast,
    ayomazeGucuruza,
  ]);

  return (
    <div
      className={cn(
        "px-1 placeholder:text-xs border-stone-900 dark:border-stone-500 w-[100px] overflow-hidden flex items-center justify-between border rounded-md relative"
      )}
    >
      <Input
        className={cn(
          "px-1 focus-visible:border-none focus:ring-0 focus:outline-none w flex-1 border-none focus-visible:ring-0"
        )}
        type="number"
        value={localInputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={0}
        max={MAX_VALUE}
        placeholder="0"
      />
      <Plus className="h-5 w-5 absolute right-1.5 top-[50%] translate-y-[-50%] hover:scale-110 cursor-pointer border dark:bg-stone-700 bg-slate-400 rounded-md" />
    </div>
  );
};

export default React.memo(TakeInputValue);
