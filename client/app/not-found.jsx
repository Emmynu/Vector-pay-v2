import Link from "next/link";
import { MoveLeft } from "lucide-react"
import Logo from "./libs/ui/logo";


export function generateMetadata() {
    return{
        title: "404 - Page not found",
        description: "This page you are looking for does not exist  or has been moved."
    }
}


function NotFound() {
    return ( 
        <main className="flex flex-col mt-[35%] md:mt-[15%] text-center items-center">
            <Logo/>
            <h1 className="text-6xl font-bold mt-5">404</h1>
            <h3 className="my-1.5 text-3xl  font-semibold">Page Not Found</h3>
            <p className="my-1.5 text-sm md:text-base ">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
            <Link href={"/dashboard"} className="btn bg-[black] p-6 w-fit flex items-center pt-5 hover:scale-97 rounded-full mt-1"><span><MoveLeft /></span>Go back Home </Link>
        </main>
     );
}

export default NotFound;