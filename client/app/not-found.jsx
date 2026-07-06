import Link from "next/link";
import { MoveLeft } from "lucide-react"

export function generateMetadata() {
    return{
        title: "404 - Page not found",
        description: "This page you are looking for does not exist  or has been moved."
    }
}


function NotFound() {
    return ( 
        <main className="flex flex-col mt-[35%] md:mt-[15%] text-center items-center">
            <h1 className="text-7xl font-bold ">404</h1>
            <h3 className="my-1.5 text-2xl md:text-4xl font-semibold">Page Not Found</h3>
            <p className="my-1.5 text-sm md:text-xl ">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
            <Link href={"/"} className="btn bg-black p-6 w-fit flex items-center pt-5 hover:scale-97 rounded-full"><span><MoveLeft /></span>Return Home </Link>
        </main>
     );
}

export default NotFound;