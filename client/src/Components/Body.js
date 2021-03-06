import React, { useState, useEffect } from "react";
import axios from "axios";
import Photo from "./BodyPhoto/Photo";
import Pagination from "./Pagination";

function Body(props) {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(16);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  let checked = props.checkedLabels;
  let labelType = props.labelType;

  const handleSetPage = (props) => {
    setPage(props);
  };

  const fetchCards = async (labels) => {
    try {
      // 요청이 시작할 때에는 error 와 cards를 초기화하고
      setError(null);
      setCards(null);
      //loading 상태를 true로 바꿈
      setLoading(true);
      let getLabelTypeIds = '';
      const getlabelInit = "&labelTypeIds[]=";
      for (let i = 0; i < labels.length; i++) {
        getLabelTypeIds += getlabelInit + labels[i];
      }
      

      const response = await axios.get(`https://tester-api.nearthlab.com/v1/photos?page=${page}&per=${limit}${getLabelTypeIds}`);
      setCards(response.data); // 데이터는 response.data 안에 들어있음

    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    
    fetchCards(checked);
    setPage(1);
  }, [checked]);

  useEffect(() => {
    
    fetchCards(checked);
  }, [page]);


  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  // 아직 users가 받아와지지 않았다면 아무것도 표시되지 않음
  if (!cards) return null;

  //드디어 cards가 성공적으로 받아와진 상태.
  return (
    <div>
      <div className="mt-6 mb-3">
        <span className="font-semibold text-md">전체 {cards.meta.total.toString()}개</span>
      </div>
      <div className="grid grid-cols-4">
        {cards.photos.map((data, index) => (
          
          <Photo key={index} data={data} labelType={labelType}/>
        ))}
      </div>
      <Pagination meta={cards.meta} handleSetPage={handleSetPage}/>
    </div>
  );
}

export default Body;
