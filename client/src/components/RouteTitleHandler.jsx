import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const RouteTitleHandler = () => {
    const location = useLocation();
    
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    useEffect(() => {
        // Check if the URL contains a product ID pattern (e.g., /product/123)
        const pathSegments = location.pathname.split("/");
        const isProductIdPath = pathSegments.includes("product") && 
            pathSegments.length > pathSegments.indexOf("product") + 1 && 
            !isNaN(pathSegments[pathSegments.indexOf("product") + 1]);
        
        // Skip title update if it's a product ID URL
        
        if (!isProductIdPath) {
            const path = location.pathname
                .split("/")
                .slice(1)
                .join(" > ");
            document.title = capitalizeWords(path);
        }
    }, [location]);
    
    return null;
}

export default RouteTitleHandler;