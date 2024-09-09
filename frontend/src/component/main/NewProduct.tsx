import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT } from "../../constant";

export const NewProduct: React.FC = () => {
    const navigate = useNavigate();
    const addToCart = () => {
        navigate('/product/12345');
    }
    return(
        <>
            <section id='newProduct' className="relative flex w-full items-center justify-center bg-fcolor top-16 mb-10 pb-10">
                <div className="flex md:flex-row flex-col gap-x-20 justify-center overflow-hidden max-w-screen-xl mt-[20px]">
                    
                    <div className="mx-[40px] mb-[40px]">
                        <img src='/images/MM23.png' className="md:h-[90%] "></img>
                    </div>
                    <div className="font-archivo-black gap-y-20 md:text-left text-center h-full">
                        <h4 className='text-xl text-orange-500 '>{NEW_PRODUCT.title}</h4>
                        <h1 className='text-[35px] text-white font-bold'>{NEW_PRODUCT.name}</h1>
                        <h4 className='text-white font-montserrat'>{NEW_PRODUCT.description}</h4>
                        <h4 className='text-[25px] text-orange-500 mt-5'>{NEW_PRODUCT.price}</h4>
                        <button className='border border-4 border-double hover:border-solid border-orange-500 text-orange-500 text-[20px] p-4 rounded-full mt-5' onClick={addToCart}>Add to Cart</button>
                    </div>
                </div>
            </section>
        </>
    );
}