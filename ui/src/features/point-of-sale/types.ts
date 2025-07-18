export interface TypeProduct {
    id: string
    product_name: string
    category: {
        id: string
        name: string
    }
    price: number
    image?: string
}