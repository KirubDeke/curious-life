import BlogSection from "./BlogSection";
import Newsletter from "./Newsletter";
import PopularPosts from "./PopularPosts";
import ProcessSteps from "./ProcessSteps";
import PublicHome from "./publichome";
import RecentPosts from "./RecentPosts";


export default function Private(){
    return(
        <>
          <PublicHome/>  
          <ProcessSteps/>
          <RecentPosts/>
          <PopularPosts/>
          {/* <BlogSection/> */}
          <Newsletter/>
        </>
    )
}