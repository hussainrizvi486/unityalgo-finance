import { useQuery } from '@tanstack/react-query';
import type { TypeProduct } from '../types';
import { SERVER_URL } from '../../../api';

const useProductQuery = () => {
    return useQuery<Array<TypeProduct>>({
        queryKey: ['product-list'],
        queryFn: () =>
            fetch(SERVER_URL + "api/products/").then((res) =>
                res.json(),
            ),

    })
}


export { useProductQuery };