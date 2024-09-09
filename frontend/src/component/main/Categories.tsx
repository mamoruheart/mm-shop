import { useEffect } from "react";
import { CategoryCard } from "../utils/CategoryCard";
import { getCategorys } from "../../redux/reducer/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { UPLOAD_URI } from "../../constant";

export const Category: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state:RootState) => state.category);
    
    useEffect(() => {
        dispatch(getCategorys(navigate));
    },[dispatch])
    return(
        <section id='category' className=" flex flex-col w-full items-center justify-center bg-white">
            <div className=' max-w-screen-xl '>
                <h1 className="md:text-[50px] text-[30px] font-archivo-black text-bold py-[50px] text-center">Our Products and Services</h1>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-5 gap-y-20 gap-x-20 mx-5">
                    {
                        categories.categorys.map((categoryItem)=>(
                            <CategoryCard  name={categoryItem.title} image={categoryItem.title + '.PNG'} badge="%%" description={categoryItem.description} id={categoryItem._id} />
                        ))
                    }
                    {/* <CategoryCard name='Rifle' image='Rifle.PNG' badge="%%" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/>
                    <CategoryCard name='Pistol' image='Pistol.PNG' badge="NEW" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/>
                    <CategoryCard name='Rifle Belt' image='Rifle Belt.PNG' badge="IN STOCK" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/>
                    <CategoryCard name='Services' image='services.PNG' badge="SOLD OUT" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/>
                    <CategoryCard name='Parts' image='parts.PNG' badge="" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/>
                    <CategoryCard name='Short Barrel Rifle' image='Short Barrel Rifle.PNG' badge="" description="7.62mm, 5.56mm MSG & PSG" id="168435435"/> */}
                </div>
            </div>

        </section>
    );
}