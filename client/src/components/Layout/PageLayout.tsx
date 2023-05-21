import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Header />
      <div className="md:container md:mx-auto">
        <div className="my-16">{children}</div>
      </div>
      <Footer />
    </div>
  );
};
export default PageLayout;
