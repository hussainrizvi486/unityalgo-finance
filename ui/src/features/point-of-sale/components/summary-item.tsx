import { FilePenLine, Minus as MinusIcon, Plus as PlusIcon, Trash2 } from "lucide-react";
import { deleteItem, updateItemQty, type TypeSummaryItem } from "../slices/summary";
import { integer } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { SERVER_URL } from "../../../api";

export const SummaryItem: React.FC<TypeSummaryItem> = (props) => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.pos);
    const summary = state.selectedSummary;
    const image = props.cover_image ?  SERVER_URL+ props.cover_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsuilBKtOw0Fx1T2c1-nJvBfWLawRf17S-Ug&s";

    const handleDelete = () => {
        dispatch(deleteItem({ id: props.id, summaryId: summary.id }));
    }

    const handleUpdateQuantity = (quantity: number) => {
        dispatch(updateItemQty({ id: props.id, summaryId: summary.id, quantity }));
    }

    return (
        <div>
            <div className="border mb-2 p-1 rounded">
                <div className="flex gap-1 flex-auto">
                    <div className="flex-shrink-0 ">
                        <img className="w-20 h-20 object-contain" src={image} alt="" />
                    </div>
                    <div className="pt-2 flex-auto ">
                        <div className="flex gap-1">
                            <div className="flex-auto">
                                <div className="text-sm line-clamp-2">{props.product_name}</div>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-1">
                                <button className="p-1.5 rounded-full bg-white cursor-pointer hover:bg-red-100 transition-colors duration-150">
                                    <Trash2 className="size-5 stroke-red-800" onClick={handleDelete} />
                                </button>

                                <button className="p-1.5 rounded-full bg-white cursor-pointer hover:bg-gray-100 transition-colors duration-150">
                                    <FilePenLine className="size-5" />
                                </button>
                            </div>
                        </div>

                        <div className="text-xs font-semibold">{props.category.name}</div>

                        <div className="flex justify-between">
                            <div className="font-semibold mt-2">$ {props.price || 0}</div>

                            <div className="flex justify-end">
                                <div className="flex items-center bg-gray-100 rounded-3xl p-1 w-24">
                                    <button
                                        className="rounded-full bg-white cursor-pointer p-1"

                                    onClick={() => handleUpdateQuantity(props.quantity - 1)}
                                    >
                                        <MinusIcon className="size-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={integer(props.quantity)}
                                        className="h-full w-full bg-transparent outline-none text-center font-bold"
                                        readOnly
                                    />
                                    <button
                                        className="rounded-full bg-white cursor-pointer p-1"
                                    onClick={() => handleUpdateQuantity(props.quantity + 1)}
                                    >
                                        <PlusIcon className="size-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}