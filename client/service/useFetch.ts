import { use, useEffect, useState } from "react";
import { fetchGetAllSeagrass } from "./api";

const useFetch = <T>(fetchFunction: ()=> Promise<T>, autoFetch=true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState< | null>(null);

const fetchData = async ()=>{
    try{
        setLoading(true);
        setError(null);
        
        const result = await fetchFunction();
        setData(result);
    } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occured'));
    } finally {
        setLoading(false);
    }
}

const reset = ()=> {
    setData(null);
    setLoading(false);
    setError(null);
}

useEffect(() => {
    if(autoFetch){
        fetchData();
    }
}, []);

return {data, loading, error, refetch:fetchData, reset}

}

export default useFetch;

export const useFetchSeagrassDetails = (id: string | numbr | undefined) => {
    const [data, setData] = useState< | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const allData = await fetchGetAllSeagrass();
                const filtered = allData.find((item: any) => item.id.toString() === id?.toString());
                setData(filtered);
            } catch (err) {
                setError(err instanceof Error ? er : new Error('An error occurred'));
            } finally {
                setLoading(false);
            }    
        };

        if (id) getDetails();
    }, [id]);

    return { data, loading, error };
 }

