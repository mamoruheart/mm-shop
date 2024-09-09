import { useNavigate } from "react-router-dom";

export const CategoryCard: React.FC<{badge: string, name: string, description: string, image: string, id: string}> = ({badge, name, description, image, id}) => {
    const navigate = useNavigate();
    return(
        <a className="relative card flex flex-col items-center rounded-tl-xl rounded-br-xl w-full border shadow-black cursor-pointer bg-black" onClick={()=>{navigate('/Categories/' + id)}}>
            <img src={'images/' + image} className="z-0 h-[150px] absolute h-full w-full object-cover blur-sm">
            </img>
            <div className="z-0">
                {/* {!!badge && (
                    <div className=" ">
                        <div className="badge bg-red-500 text-white px-2 py-2 rounded-tl-xl rounded-br-xl text-xs absolute left-0 top-0">{badge}</div>
                    </div>
                )} */}
                {/* <div className="flex flex-row justify-center w-full p-3 ">
                    <img src={'images/' + image} className="h-[150px] self-auto">
                    </img>
                </div> */}
                <div className="w-full">
                    <h3 className='text-[24px] font-bold text-white text-center font-archivo-black mt-[110px] px-2'>{name}</h3>
                </div>
                {!!description && (
                    <div className="flex flex-row justify-center w-full text-white pt-5 px-3 pb-6">
                        <p className='text-[13px] font-bold font-montserrat'>{description}</p>
                    </div>
                )}
            </div>
        </a>
    );
}