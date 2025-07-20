import { useQuery } from '@tanstack/react-query';
import { SERVER_URL } from '../../../api';
import type { TypePOSProfile } from '../types';


import type { UseQueryResult } from '@tanstack/react-query';

const useProfileQuery = (): UseQueryResult<TypePOSProfile, Error> => {
    return useQuery<TypePOSProfile, Error>({
        queryKey: ['pos-profile'],
        queryFn: () =>
            fetch(SERVER_URL + "api/pos/get-profile").then((res) =>
                res.json(),
            ),
    });
}


export { useProfileQuery };