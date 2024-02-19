import React from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { BsFillPeopleFill , BsPersonFillAdd } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

export default class Contact extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      active:'listFriend'
    };
  }
  handler(tab){
    this.setState({
        active: tab
    });
  }
  render() {
    return (
      <>
        <Content>
          <ContentLeft className="ListPerson">
            <HeaderList className="HeaderList">
              <Search className="Search">
                <button
                  style={{ fontSize: "15px", padding: "5px", border: "none" }}
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
                    $active = {this.state.active === 'listFriend'}
                    onClick={()=> this.handler('listFriend')}
                    >
                    <IoPerson style={{marginRight:'10px', fontSize:'25px'}} />
                    Danh sách bạn bè
                </Button>
                <Button
                    $active = {this.state.active === 'listGroup'}
                    onClick={()=> this.handler('listGroup')}
                    >
                    <BsFillPeopleFill style={{marginRight:'10px', fontSize:'25px'}} />
                    Danh sách nhóm
                </Button>
                <Button
                    $active = {this.state.active === 'listAdd'}
                    onClick={()=> this.handler('listAdd')}
                    >
                    <BsPersonFillAdd style={{marginRight:'10px', fontSize:'25px'}} />
                    Lời mời kết bạn
                </Button>
            </ContentList>
          </ContentLeft>
          <ContentRight className="ContentBody">

          </ContentRight>
        </Content>
      </>
    );
  }
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
  border-right: 1px solid rgb(219, 223, 229);
`;
