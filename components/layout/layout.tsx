import MenuNav from "./menu";

// export const getStaticProps = async ({ locale }: { locale: string }) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ["common"])),
//   },
// });

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <script src="/assets/vendors/popper.min.js" defer />
      <script src="/assets/vendors/bootstrap.min.js" defer />
      <script src="/assets/js/nifty.js" defer />
      <script type="text/javascript" src="/assets/js/xlsx.full.min.js" defer />
      <script src="/assets/vendors/mdDateTimePicker.min.js" defer />
      <script src="/assets/js/tooltips-popovers.js" defer />
      <title>WEMS</title>

      <div id="root" className="root mn--max hd--sticky hd--expanded">
        <section id="content" className="content">
          <main>{props.children}</main>
        </section>
        <MenuNav />
      </div>

      <div className="scroll-container">
        <a
          href="#root"
          className="scroll-page rounded-circle ratio ratio-1x1"
          aria-label="Scroll button"
        ></a>
      </div>
    </>
  );
};

export default Layout;
