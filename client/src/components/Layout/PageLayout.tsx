import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="flex flex-col items-center h-full min-h-screen px-4 py-8 mx-6 my-16 ">
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default PageLayout;
