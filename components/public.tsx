"use client";

import BlogSection from "./BlogSection";
import Newsletter from "./Newsletter";
import PopularPosts from "./PopularPosts";
import ProcessSteps from "./ProcessSteps";
import PublicHome from "./publichome";
import RecentPosts from "./RecentPosts";

export default function Public(){
    return(
        <>
            <PublicHome/>
            <ProcessSteps/>
            {/* <BlogSection/> */}
            <RecentPosts/>
            <PopularPosts/>
            {/* <RecentPost/> */}
            <Newsletter/>
        </>
    )
}

