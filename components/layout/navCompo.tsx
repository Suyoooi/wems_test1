import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const NavItem = () => {
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const router = useRouter();
  const activeLink = (url: string, pathname: string) =>
    pathname === url ? "nav-link active" : "nav-link";

  const arrActiveLink = (url: string[], pathname: string) => {
    const findData = url.includes(pathname);

    if (findData) {
      return "mininav-toggle nav-link active";
    } else {
      return "mininav-toggle nav-link collapsed";
    }
  };

  const menuItem = [
    // {
    //   id: 10000,
    //   name: '대시보드',
    //   items: [
    //     {
    //       id: 10001,
    //       name: '대시보드',
    //       activeUrl: ['/dash/board'],
    //       url: '/dash/board',
    //       imgUrl: 'i_menu i_m_dashboard',
    //       imgAlt: 'Dash Board',
    //       subItems: []
    //     }s
    //   ]
    // },
    {
      id: 20000,
      name: t("MUL_WD_0008"),
      items: [
        {
          id: 20001,
          name: t("MUL_WD_0067"),
          activeUrl: [
            "/situation/ems/allSitu",
            "/situation/ems/srvrInfo",
            "/situation/ems/sysHist",
          ],
          url: "",
          imgUrl: "i_menu i_m_emsserver",
          imgAlt: "EMS Server",
          subItems: [
            {
              id: 20002,
              name: t("MUL_WD_0068"),
              url: "/situation/ems/allSitu",
            },
            // { id: 20003, name: '서버 정보', url: '/situation/ems/srvrInfo' },
            // { id: 20004, name: '시스템 이력', url: '/situation/ems/sysHist' },
          ],
        },
        {
          id: 20005,
          name: "Queue",
          activeUrl: [
            "/situation/queue/list",
            "/situation/queue/consumer",
            "/situation/queue/browse",
            "/situation/queue/history",
          ],
          url: "",
          imgUrl: "i_menu i_m_queue",
          imgAlt: "Queue",
          subItems: [
            { id: 20006, name: t("MUL_WD_0086"), url: "/situation/queue/list" },
            // { id: 20007, name: 'Consumer Display', url: '/situation/queue/consumer' },
            // { id: 20008, name: 'Queue Monitor', url: '/situation/queue/monitor' },
            { id: 20009, name: "Queue Browse", url: "/situation/queue/browse" },
            {
              id: 20010,
              name: t("MUL_WD_0074"),
              url: "/situation/queue/history",
            },
          ],
        },
        {
          id: 20011,
          name: "Topic",
          activeUrl: [
            "/situation/topic/list",
            "/situation/topic/consumer",
            "/situation/topic/subscription",
            "/situation/topic/history",
          ],
          url: "",
          imgUrl: "i_menu i_m_topic",
          imgAlt: "Topic",
          subItems: [
            { id: 20012, name: t("MUL_WD_0088"), url: "/situation/topic/list" },
            // { id: 20013, name: 'Topic Consumer', url: '/situation/topic/consumer' },
            {
              id: 20014,
              name: "Topic Subscription",
              url: "/situation/topic/subscription",
            },
            // { id: 20015, name: 'Topic Subscriber', url: '/situation/topic/subscriber' },
            {
              id: 20016,
              name: t("MUL_WD_0089"),
              url: "/situation/topic/history",
            },
          ],
        },
        {
          id: 20017,
          name: "Durable",
          activeUrl: ["/situation/durable/list"],
          url: "/situation/durable/list",
          imgUrl: "i_menu i_m_durable",
          imgAlt: "Durable",
          subItems: [],
        },
        {
          id: 20018,
          name: "Consumer",
          activeUrl: ["/situation/consumer/list"],
          url: "/situation/consumer/list",
          imgUrl: "i_menu i_m_consumer",
          imgAlt: "Consumer",
          subItems: [],
        },
        {
          id: 20019,
          name: "Producer",
          activeUrl: ["/situation/producer/list"],
          url: "/situation/producer/list",
          imgUrl: "i_menu i_m_producer",
          imgAlt: "Producer",
          subItems: [],
        },
        {
          id: 20020,
          name: "Store",
          activeUrl: ["/situation/store/history"],
          url: "",
          imgUrl: "i_menu i_m_store",
          imgAlt: "Store",
          subItems: [
            {
              id: 20021,
              name: t("MUL_WD_0087"),
              url: "/situation/store/history",
            },
          ],
        },
      ],
    },
    {
      id: 30000,
      name: t("MUL_WD_0015"),
      items: [
        {
          id: 30001,
          name: t("MUL_WD_0090"),
          activeUrl: [
            "/setting/srvr/list",
            "/setting/ems/srvrList",
            "/setting/ems/srvrProp",
            "/setting/ems/userInfo",
          ],
          url: "",
          imgUrl: "i_menu i_m_emsserver",
          imgAlt: "EMS Server",
          subItems: [
            { id: 30002, name: t("MUL_WD_0091"), url: "/setting/srvr/list" },
            { id: 30003, name: t("MUL_WD_0090"), url: "/setting/ems/srvrList" },
            {
              id: 30004,
              name: t("MUL_WD_0092"),
              url: "/setting/ems/srvrProp",
            },
            {
              id: 30005,
              name: t("MUL_WD_0093"),
              url: "/setting/ems/userInfo",
            },
          ],
        },
        {
          id: 30006,
          name: "Queue/Topic",
          activeUrl: [
            "/setting/qt/queue",
            "/setting/qt/topic",
            "/setting/qt/addInfo",
            "/setting/qt/changeProp",
            "/setting/qt/permission",
          ],
          url: "",
          imgUrl: "i_menu i_m_queue",
          imgAlt: "Queue Topic",
          subItems: [
            { id: 30007, name: "Queue", url: "/setting/qt/queue" },
            { id: 30008, name: "Topic", url: "/setting/qt/topic" },
            // { id: 30009, name: 'Q/T 추가', url: '/setting/qt/addInfo' },
            {
              id: 30010,
              name: t("MUL_WD_0094"),
              url: "/setting/qt/changeProp",
            },
            {
              id: 30011,
              name: t("MUL_WD_0139"),
              url: "/setting/qt/permission",
            },
          ],
        },
        {
          id: 30012,
          name: "Durable",
          activeUrl: ["/setting/durable/list"],
          url: "/setting/durable/list",
          imgUrl: "i_menu i_m_durable",
          imgAlt: "Durable",
          subItems: [],
        },
        {
          id: 30013,
          name: "Connection",
          activeUrl: ["/setting/connect/list"],
          url: "/setting/connect/list",
          imgUrl: "i_menu i_m_connection",
          imgAlt: "",
          subItems: [],
        },
        {
          id: 30014,
          name: "Bridges",
          activeUrl: ["/setting/bridge/list"],
          url: "/setting/bridge/list",
          imgUrl: "i_menu i_m_bridges",
          imgAlt: "",
          subItems: [],
        },
      ],
    },
    {
      id: 40000,
      name: t("MUL_WD_0095"),
      items: [
        {
          id: 40001,
          name: t("MUL_WD_0060"),
          activeUrl: ["/setting/user/list"],
          url: "/setting/user/list",
          imgUrl: "i_menu i_m_useradmin",
          imgAlt: "User",
          subItems: [],
        },
      ],
    },
  ];

  return (
    <>
      {menuItem.map((item: any, idx: number) => (
        <>
          <div className="mainnav__categoriy" key={item.id}>
            <h6 className="px-3 mt-0 mainnav__caption fw-bold">{item.name}</h6>
            <ul className="mainnav__menu nav flex-column">
              {item.items.map((subItem: any) =>
                subItem.subItems.length === 0 ? (
                  <li className="nav-item has-sub" key={subItem.id}>
                    <Link
                      href={subItem.url}
                      className={activeLink(subItem.url, router.pathname)}
                    >
                      {/* <Image src={subItem.imgUrl} alt={subItem.imgAlt} width={16} height={16} /> */}
                      <span className={subItem.imgUrl}></span>
                      <span className="nav-label ml_10">{subItem.name}</span>
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item has-sub" key={subItem.id}>
                    <Link
                      href="#"
                      className={arrActiveLink(
                        subItem.activeUrl,
                        router.pathname
                      )}
                    >
                      {/* <Image src={subItem.imgUrl} alt={subItem.imgAlt} width={16} height={16} /> */}
                      <span className={subItem.imgUrl} />
                      <span className="nav-label ml_10">{subItem.name}</span>
                    </Link>
                    <ul className="mininav-content nav collapse">
                      {subItem.subItems.map((sub: any) => (
                        <li className="nav-item" key={sub.id}>
                          <Link
                            href={sub.url}
                            className={activeLink(sub.url, router.pathname)}
                          >
                            {sub.name}
                            {/* {t(sub.name)} */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              )}
            </ul>
          </div>
        </>
      ))}
    </>
  );
};
export default NavItem;
