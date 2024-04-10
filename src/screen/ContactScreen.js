import React, { useState } from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { BsFillPeopleFill, BsPersonFillAdd } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import ListFriend from "../component/listFriend.js";
import { getApiNoneToken } from "../api/Callapi.js";
import Friend from "../component/friend.js";
const Contact = ({userLogin}) => {
  const [active, setActive] = useState('listFriend');
  //eslint-disable-next-line
  const [search, setSearch] = useState('');
  const handler = (tab) => {
    setActive(tab);
  };
  const handleFriendSearch =async (event) => {
    try{
      const searchKeyword = event.target.value.toLowerCase();
        const response = await getApiNoneToken("/getDetailsByPhone/"+searchKeyword, {
          phone: searchKeyword,
        });
        setSearch(response.data.data._id);
    }catch (error) {
      console.log(error);
    }
    if (event.target.value.trim() === "") {
      setSearch("");
    }
  }

  return (
    <>
      <Content>
        <ContentLeft className="ListPerson">
          <HeaderList className="HeaderList">
            <Search className="Search">
              <button
                style={{ fontSize: "15px", padding: "5px", border: "none"}}
              >
                <FaSearch />
              </button>
              <input  
                style={{
                  fontSize: "15px",
                  padding: "6px",
                  outline: "0",
                  border: "none",
                  background: "rgb(240,240,240)",
                }}
                placeholder="Tìm kiếm"
                onChange={handleFriendSearch}
              ></input>
            </Search>
            <button
              style={{
                border: "none",
                fontSize: "15px",
                background: "white",
                padding: "0",
              }}
            >
              <MdOutlinePersonAddAlt1 style={{ fontSize: "24px" }} />
            </button>
            <button
              style={{
                border: "none",
                fontSize: "15px",
                background: "white",
                padding: "0",
              }}
            >
              <MdOutlineGroupAdd style={{ fontSize: "24px" }} />
            </button>
          </HeaderList>
          <ContentList className="ContentList">
              <Button
                  $active = {active === 'listFriend'}
                  onClick={()=> handler('listFriend')}
                  >
                  <IoPerson style={{marginRight:'10px', fontSize:'25px'}} />
                  Danh sách bạn bè
              </Button>
              <Button
                  $active = {active === 'listGroup'}
                  onClick={()=> handler('listGroup')}
                  >
                  <BsFillPeopleFill style={{marginRight:'10px', fontSize:'25px'}} />
                  Danh sách nhóm
              </Button>
              <Button
                  $active = {active === 'listAdd'}
                  onClick={()=> handler('listAdd')}
                  >
                  <BsPersonFillAdd style={{marginRight:'10px', fontSize:'25px'}} />
                  Lời mời kết bạn
              </Button>
          </ContentList>
        </ContentLeft>
        <ContentRight className="ContentBody">
        {search !== "" ?<><Friend idSearch={search} idUser={userLogin} />
              </>
              :
              active ==="listFriend" && <ListFriend userLogin={userLogin} /> 
         }
        </ContentRight>
      </Content>
    </>
  );
}

const Button = styled.div`
  padding: 15px;
  font-size: 20px;
  background: ${(props) => (props.$active ? 'rgb(229,239,255)' : 'normal')};
  font-weight: ${(props) => (props.$active ? 'bold': 'normal')};
`;
const ContentRight = styled.div`
height: 100vb;
width: 85%;
display: flex;
`;
const Content = styled.div`
height: 100vb;
width: 100%;
display: flex;
box-sizing: border-box;
`;
const Search = styled.div`
padding: 5px;
display: flex;
overflow: hidden;
`;
const ContentList = styled.div`
height: 100vh;
margin: 0;
`;
const HeaderList = styled.div`
background: white;
padding: 10px;
height: 5%;
display: flex;
align-items: center;
justify-content: space-between;
`;
const ContentLeft = styled.div`
height: 100%;
width: 25%;
overflow: hidden;
`;

export default Contact;
