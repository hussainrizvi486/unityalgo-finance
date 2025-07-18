import { PackageIcon, Search as SearchIcon } from "lucide-react";
import { Summary } from "../components/summary"
import { useProductQuery } from "../api/product";
import { ProductCard } from "../components/product-card";
import { addItem } from "../slices/summary";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";


const SearchBar = () => {
    return (
        <div className="w-[40rem] flex items-center px-4 rounded-full py-2 border border-gray-300 ring-offset-2 focus-within:ring-2 ring-primary ">
            <input
                type="text"
                placeholder="Search, by name, SKU, Barcode"
                className="w-full text-sm outline-none"
            />
            <SearchIcon />
        </div>
    )
}

const Brand = () => {
    return (
        <div className="text-2xl font-bold">
            UnityPOS
        </div>
    )
}
const Header = () => {
    return (
        <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-4">
                    <Brand />
                </div>


                <SearchBar />
            </div>


            <div>
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        <span className="absolute -inset-1.5"></span>
                        <img
                            className="size-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                            alt=""
                        />
                    </button>

                    <div className="text-sm"> John Hammand</div>
                </div>
            </div>
        </div>
    )
}

const ItemGridLoading = () => {
    return (
        <div className="grid gap-2 grid-cols-6  px-4">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 rounded-md bg-amber-100"></div>
            ))}
        </div>
    )
}



const Index = () => {
    const dispatch = useDispatch();
    const { data: products, isLoading, isSuccess } = useProductQuery();
    const state = useSelector((state: RootState) => state.pos);

    // console.log(data);
    return (
        <div>
            <Header />
            <div>
                <div className="grid grid-cols-10 gap-1">
                    <div className="col-span-7">
                        <div className="overflow-y-scroll h-[90vh]">
                            {
                                isLoading ? <ItemGridLoading /> :
                                    isSuccess && products?.length ? <div className="grid gap-2 grid-cols-6  px-4">
                                        {
                                            products.map((product, i) => (
                                                <div key={i}
                                                    onClick={() => dispatch(addItem({ product: { ...product, quantity: 1 }, id: state.selectedSummary.id }))}
                                                >
                                                    <ProductCard product={product} />
                                                </div>))
                                        }
                                    </div> : <div className="flex justify-center items-center flex-col p-6">
                                        <PackageIcon className="stroke-gray-500 size-10" />
                                        <div className="text-center text-gray-500 mt-2 font-semibold">
                                            No items
                                        </div>
                                    </div>
                            }
                        </div>

                    </div>

                    <div className="flex-shrink-0 bg-white p-3 rounded-md border  border-red-100 col-span-3">
                        <Summary />
                    </div>
                </div>
            </div >
        </div>
    )
}


export default Index;