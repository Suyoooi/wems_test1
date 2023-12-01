import WebUserModal from "@/components/modal/webUser/webUserModal";
import { parseCookies } from "nookies";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ColumnDefinition,
  ReactTabulator,
  reactFormatter,
} from "react-tabulator";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const List = () => {
  let url = `/api/webUser/webUserApi`;
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const dispatch = useDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<[]>([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userPermission, setUserPermission] = useState("");
  const [modalData, setModalData] = useState(null);

  // 마스킹 함수 //
  const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    // 가운데 4자리 마스킹 처리
    const masked = phoneNumber.replace(
      /(\d{2,3})(\d{4})(\d{4})/,
      (_, first, middle, last) => {
        const maskedMiddle = middle.replace(/\d/g, "*");
        return `${first}-${maskedMiddle}-${last}`;
      }
    );
    return masked;
  };

  const maskName = (name: string) => {
    if (!name || name.length <= 2) return name;

    const firstChar = name.charAt(0);
    const lastChar = name.charAt(name.length - 1);
    const masked = firstChar + "*".repeat(name.length - 2) + lastChar;
    return masked;
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length === 2) {
      const maskedLocalPart =
        parts[0].substring(0, 2) + "*".repeat(parts[0].length - 2);
      return `${maskedLocalPart}@${parts[1]}`;
    }
    return email;
  };

  // tabulator 옵션
  const options = {
    layout: "fitDataTable",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    scrollable: true,
    placeholder: t("MUL_WD_0137"),
  };

  const USER_COLUMNS_LIST: ColumnDefinition[] = [
    {
      title: "No",
      field: "dataNo",
      formatter: "rownum",
      headerTooltip: true,
      hozAlign: "center",
      width: 70,
      headerSort: false,
    },
    {
      title: t("MUL_WD_0031"),
      field: "user_id",
      headerTooltip: true,
      hozAlign: "center",
      width: 200,
    },
    {
      title: t("MUL_WD_0032"),
      field: "user_nm",
      headerTooltip: true,
      hozAlign: "center",
      width: 150,
      formatter: (cell) => {
        return maskName(cell.getValue());
      },
    },
    {
      title: t("MUL_WD_0033"),
      field: "user_rol_cd",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
    {
      title: t("MUL_WD_0034"),
      field: "user_stts_cd",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
      formatter: (cell) => {
        return "ACTIVE";
      },
    },
    {
      title: t("MUL_WD_0035"),
      field: "user_telno_enc",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      formatter: (cell) => {
        return maskPhoneNumber(cell.getValue());
      },
    },
    {
      title: t("MUL_WD_0036"),
      field: "user_eml",
      headerTooltip: true,
      hozAlign: "left",
      width: 180,
      formatter: (cell) => {
        return maskEmail(cell.getValue());
      },
    },
    {
      title: t("MUL_WD_0037"),
      field: "lgn_fail_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 220,
    },
    {
      title: t("MUL_WD_0038"),
      field: "pwd_epi_date",
      headerTooltip: true,
      hozAlign: "center",
      width: 220,
    },
    {
      title: "",
      field: "action",
      hozAlign: "center",
      headerTooltip: true,
      width: 80,
      formatter: reactFormatter(<ActionButton />),
    },
  ];

  function ActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;

    return (
      <>
        <div className="gap-2 row" style={{ paddingLeft: "7px" }}>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0045") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => patchData(rowData, cell)}
          >
            <i className="i_modify icon-sm fs-5"></i>
          </button>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0046") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => deleteData(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  // 수정
  async function patchData(rowData: any, cell: any) {
    setModalData(rowData);
    setOpenModal(true);
    onClickToggleModal();
  }

  // 삭제
  const deleteData = async (rowData: any) => {
    const delUserSn = rowData.user_sn;
    const delUserNm = rowData.user_nm;
    const delUserId = rowData.user_id;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Do you want to delete the following users?\nTarget: [ ${delUserId} ]?`;
    } else if (lang === "ko") {
      confirmVal = `다음의 사용자를 삭제하시겠습니까?\n대상: [ ${delUserId} ]`;
    }

    if (confirm(confirmVal)) {
      const delBodyData = {
        case_method: "DEL",
        user_sn: delUserSn,
        access_token: accessToken,
      };

      const res = await fetch(url, {
        body: JSON.stringify(delBodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data && data.code == 200) {
        alert(t("MUL_ST_00150"));
        fetchTableDataAsync();
      } else {
        alert(t("MUL_ST_00151"));
      }
    }
  };

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        user_id: userId,
        user_nm: userName,
        user_rol_cd: userPermission,
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      setFilteredData(dataInfo);

      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, []);

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableDataAsync();
    }
  };

  // 조회 버튼
  const handleViewButtonClick = async () => {
    try {
      await fetchTableDataAsync();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleAddButtonClick = () => {
    setOpenModal(true);
    setModalData(null);
    onClickToggleModal();
  };

  // property 모달 열고 닫기
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };
  const onClickToggleModal = useCallback(() => {
    if (isOpenModal) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isOpenModal]);

  return (
    <div>
      <section id="content" className="content">
        {isOpenModal && (
          <WebUserModal
            onClickToggleModal={handleCloseModal}
            rowData={modalData}
            callbackFunction={callbackFunction}
          />
        )}
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            {/* <!-- page position -->   */}
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("MUL_WD_0060")}
                </li>
              </ol>
            </nav>
            {/* <!-- page position -->  */}
            <h1 className="mt-2 mb-0 page-title">{t("MUL_WD_0060")}</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              {/* <!-- search --> */}
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  {/* <!-- Userid --> */}
                  <div className="row col-md-3">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="input_userid"
                    >
                      {t("MUL_WD_0031")}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="input_userid"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <!-- Username --> */}
                  <div className="row col-md-3">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="input_username"
                    >
                      {t("MUL_WD_0032")}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="input_username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <!-- User --> */}
                  <div className="row col-md-3">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sel_userpower"
                    >
                      {t("MUL_WD_0033")}
                    </label>
                    <div className="col-sm-8">
                      <select
                        value={userPermission}
                        onChange={(e) => setUserPermission(e.target.value)}
                        className="form-select"
                        id="sel_userpower"
                      >
                        <option selected value="">
                          = {t("MUL_WD_0062")} =
                        </option>
                        <option value="ADMIN">{t("MUL_WD_0063")}</option>
                        <option value="USER">{t("MUL_WD_0064")}</option>
                      </select>
                    </div>
                  </div>
                  {/* <!-- button : 조회 --> */}
                  <div className="col-3 justify-content-start">
                    <button
                      onClick={handleViewButtonClick}
                      type="button"
                      className="gap-2 btn btn-dark hstack"
                    >
                      <i className="i_view_search fs-5"></i> {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- table / tabulator --> */}
              <div className="mt-3 row">
                <div className="col-md-6">
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={handleAddButtonClick}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0061")}
                  </button>
                </div>
                {/* <WebUserModal /> */}
                <div className="table-responsive">
                  <ReactTabulator
                    key={filteredData.length}
                    ref={tableRef}
                    autoResize={false}
                    options={options}
                    data={filteredData}
                    columns={USER_COLUMNS_LIST}
                  />
                </div>
              </div>
              {/* <!-- table / tabulator -->	 */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default List;
