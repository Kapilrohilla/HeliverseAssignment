import { UserContext } from "../../context/Context";
import { useContext } from "react";
import "./pagination.scss";
import IconRight from "../../Icons/Right";
import IconLeft from "../../Icons/Left";
const disabledBtn = {
  backgroundColor: "#eee",
  color: "black",
};
const Pagination = () => {
  const { page, setPage, totalPage } = useContext(UserContext);
  function prevPage() {
    if (page === 1) {
      return;
    }
    setPage(page - 1);
  }
  function nextPage() {
    if (page === totalPage) {
      return;
    }
    setPage(page + 1);
  }
  return (
    <nav className="pagination">
      <button
        className="preNav"
        onClick={prevPage}
        disabled={page === 1 ? true : false}
        style={page === 1 ? disabledBtn : {}}
      >
        <IconLeft />
      </button>
      {page} of {totalPage}
      <button
        className="nextNav"
        onClick={nextPage}
        disabled={page === totalPage ? true : false}
        style={page === totalPage ? disabledBtn : {}}
      >
        <IconRight />
      </button>
    </nav>
  );
};
export default Pagination;
