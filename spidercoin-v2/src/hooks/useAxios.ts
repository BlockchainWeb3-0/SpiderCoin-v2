import axios from "axios";
import { useEffect, useState } from "react";

const useAxios = (axiosParams: any) => {
    const [data, setData] = useState({ chain: [] });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async (params: any) => {
        try {
            const result = await axios(params);
            setData(result.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(axiosParams);
    }, []);

    return { data, error, loading };
};

export default useAxios;
