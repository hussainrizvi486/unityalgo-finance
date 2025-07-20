import { SERVER_URL } from "../../../api";
import { formatCurrency } from "../../../utils";
import type { TypeProduct } from "../types";



interface ProductCardProps {
    product: TypeProduct
}


export const ProductCard: React.FC<ProductCardProps> = (props) => {
    const { product } = props;

    const image = product.cover_image ? SERVER_URL + product.cover_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsuilBKtOw0Fx1T2c1-nJvBfWLawRf17S-Ug&s"
    return (
        <div
            className="p-1 h-48 bg-white rounded-md cursor-pointer border border-gray-300"
        >
            <div className="h-28">
                <img
                    src={image}
                    alt={product.product_name}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="item-card__details">
                <div className="text-sm overflow-hidden min-h-10 line-clamp-2">
                    {product.product_name}
                </div>
                <div className="text-sm font-semibold  mt-1">{formatCurrency(product.price)}</div>
            </div>
        </div>
    )
}
