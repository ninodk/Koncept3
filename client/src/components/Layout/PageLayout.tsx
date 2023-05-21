import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="flex flex-col w-full h-full min-h-screen">
        <div className="mx-6 my-16">{children}</div>
      </div>
      <Footer />
    </div>
  );
};
export default PageLayout;
