import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addItem } from "../../redux/reducer/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Product } from "../../redux/reducer/productSlice";
import { UPLOAD_URI } from "../../constant";

export const ProductCard: React.FC<{product: Product}> = ({product}) => {
    
    const navigate = useNavigate();

    const dispatch = useDispatch();
    
    const addToCart = () => {
        dispatch(addItem({
            ...product,
            quantity: 1
        }))
    }
    return(  
        <div className=" w-full max-w-xs mx-auto bg-white shadow-md">
            <div className="px-[10px] py-[10px]">
                <img
                src={ UPLOAD_URI + product.images[0] } // Replace with actual image URL
                alt="Product"
                className="object-contain object-center w-full h-36 mx-auto"
                />
            </div>
            <div className="px-8 pb-1">
                <h3 className="text-md font-semibold text-center text-gray-800">{product.title}</h3>
                <p className="text-md font-bold text-center text-orange-500">${product.price}</p>
            </div>
            <div className="w-full border-t-[1px] border-gray flex flex-row justify-center gap-x-10 p-1">
                <button className="w-[36px] h-[36px] rounded-full text-xl font-semibold text-center text-black bg-white hover:bg-scolor hover:text-white " onClick={()=>{navigate(`/product/${product._id}`)}}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="w-[36px] h-[36px] rounded-full text-xl font-semibold text-center text-black bg-white hover:bg-scolor hover:text-white "
                    onClick={addToCart}>
                    <FontAwesomeIcon icon={faCartPlus} />
                </button>
            </div>
            
        </div>
    );
}