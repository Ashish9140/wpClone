import axios from "axios";
import { useEffect, useContext } from "react";
import { CartContext } from "../CartContext";

const Loading = ({ setLoading }) => {
    const { setUser } = useContext(CartContext);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/api/user/refresh', { withCredentials: true });
                setUser(data.user);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);
    return (
        <div>Loading</div>
    )
}

export default Loading