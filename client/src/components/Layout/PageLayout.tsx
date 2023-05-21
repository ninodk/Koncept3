import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen py-16 mx-6 my-16 ">
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default PageLayout;
