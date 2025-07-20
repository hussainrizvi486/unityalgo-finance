export interface TypeProduct {
    id: string
    product_name: string
    category: {
        id: string
        name: string
    }
    price: number
    cover_image?: string
}

export interface TypePOSProfile {
    id: string
    name: string
    currency: string
    price_list: {
        id: string
        name: string
        currency: string
        is_default: boolean
    }
}