import Footer from "./Footer";
import Header from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
export default PageLayout;
