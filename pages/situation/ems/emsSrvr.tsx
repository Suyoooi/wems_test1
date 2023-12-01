import { useTranslation } from "next-i18next";
import { parseCookies } from "nookies";

export default function EmsSrvr() {
  const { t, i18n } = useTranslation("common");
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];

  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">
                  <a href="./index.html">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("EMS 서버 관리")}
                </li>
              </ol>
            </nav>

            <h1 className="mt-2 mb-0 page-title">{t("EMS 서버 관리")}</h1>

            <p className="lead"></p>
          </div>
        </div>

        <div className="content__boxed">
          <div className="content__wrap">
            <div className="mb-4 card">
              <div className="card-body">
                <h5 className="card-title">{t("Your content here")}</h5>
                <p>
                  {t(
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                  )}
                </p>
                <div className="gap-3 mt-4 d-flex">
                  <button className="btn btn-lg btn-light" type="button">
                    Back
                  </button>
                  <div className="bg-[#515560] rounded-lg ">
                    <a className="btn btn-lg" href="./index.html">
                      Homepage
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <article className="gap-4 d-md-flex">
              <div className="flex-fill">
                <section id="navigation-tips" className="mb-4 card">
                  <div className="card-body">
                    <h4 className="px-2 mb-3">Navigation</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="w-400px">
                              Max navigation by default
                            </td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--max
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Min navigation by default</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--min
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>
                              OffCanvas navigation with{" "}
                              <h6 className="d-inline-block">PUSH</h6> mode by
                              default
                            </td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--push
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>
                              OffCanvas navigation with{" "}
                              <h6 className="d-inline-block">SLIDE</h6> mode by
                              default
                            </td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--slide
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>
                              OffCanvas navigation with{" "}
                              <h6 className="d-inline-block">REVEAL</h6> mode by
                              default
                            </td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--slide
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Sticky navigation</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .mn--sticky
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Create a ToggleButton for navigation</td>
                            <td>
                              <p>
                                Add a className{" "}
                                <code className="px-2 py-1 bg-gray-300 rounded">
                                  .nav-toggler
                                </code>{" "}
                                to the button.
                              </p>
                              <p>Example :</p>
                              <button className="btn btn-lg btn-primary nav-toggler">
                                Toggle Navigation
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section id="sidebar-tips" className="mb-4 card">
                  <div className="card-body">
                    <h4 className="px-2 mb-3">Sidebar</h4>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="w-400px">
                              Disable sidebar backdrop
                            </td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--bd-0
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Static position</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--static
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Stuck sidebar as the default mode</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--stuck
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Unite sidebar as the default mode</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--unite
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Pinned sidebar as the default mode</td>
                            <td>
                              Add a className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--pinned
                              </code>{" "}
                              to the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Toggle visibility</td>
                            <td>
                              Toggle the className{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .sb--show
                              </code>{" "}
                              in the{" "}
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                #root
                              </code>
                              .
                            </td>
                          </tr>
                          <tr>
                            <td>Create a ToggleButton for Sidebar</td>
                            <td>
                              <p>
                                Add a className{" "}
                                <code className="px-2 py-1 bg-gray-300 rounded">
                                  .sidebar-toggler
                                </code>{" "}
                                to the button.
                              </p>
                              <p>Example :</p>
                              <button className="btn btn-lg btn-primary sidebar-toggler">
                                Toggle Sidebar
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section id="animations-tips" className="mb-4 card">
                  <div className="card-body">
                    <h4 className="px-2 mb-3">Animations</h4>
                    <p className="px-2">
                      Add the following className to the{" "}
                      <code className="px-2 py-1 bg-gray-300 rounded">
                        body
                      </code>{" "}
                      to change the animation transition.
                    </p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "250px" }}>
                              Transition function name
                            </th>
                            <th>className name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>In Quart</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .in-quart
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>Out Quart</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .out-quart
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>In Back</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .in-back
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>Out Back</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .out-back
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>In Out Back</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .in-out-back
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>easeInOutBack</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .easeInOutBack
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>steps</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .steps
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>jumping</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .jumping
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <td>rubber</td>
                            <td>
                              <code className="px-2 py-1 bg-gray-300 rounded">
                                .rubber
                              </code>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </div>
              <div className="flex-shrink-0 w-md-160px w-xl-250px">
                <div className="card position-sticky" style={{ top: "1rem" }}>
                  <div className="card-body">
                    <h5>Tips on this page : </h5>
                    <nav className="nav flex-column">
                      <a className="px-0 nav-link" href="#boxed-layout-tips">
                        Boxed layout
                      </a>
                      <a className="px-0 nav-link" href="#color-schemes-tips">
                        Color Scemes
                      </a>
                      <a className="px-0 nav-link" href="#header-tips">
                        Header
                      </a>
                      <a className="px-0 nav-link" href="#navigation-tips">
                        Navigation
                      </a>
                      <a className="px-0 nav-link" href="#sidebar-tips">
                        Sidebar
                      </a>
                      <a className="px-0 nav-link" href="#animations-tips">
                        Animations
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        {/* <!-- FOOTER --> */}
        <footer className="mt-auto">
          <div className="content__boxed">
            <div className="py-3 content__wrap py-md-1 d-flex flex-column flex-md-row align-items-md-center">
              <div className="mb-4 text-nowrap mb-md-0">
                Copyright &copy; 2022{" "}
                <a href="#" className="ms-1 btn-link fw-bold">
                  My Company
                </a>
              </div>
              <nav
                className="gap-1 nav flex-column flex-md-row gap-md-3 ms-md-auto"
                style={{ rowGap: "0 !important" }}
              >
                <a className="px-0 nav-link" href="#">
                  Policy Privacy
                </a>
                <a className="px-0 nav-link" href="#">
                  Terms and conditions
                </a>
                <a className="px-0 nav-link" href="#">
                  Contact Us
                </a>
              </nav>
            </div>
          </div>
        </footer>
        {/* <!-- END - FOOTER --> */}
      </section>
    </>
  );
}
