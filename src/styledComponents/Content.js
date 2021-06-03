import styled from "styled-components";

export const Container = styled.div`
  margin: 0 auto;
  margin-top: 125px;
  width: 937px;

  h1 {
    font-size: 43px;
    font-family: "Oswald", sans-serif;
    color: #fff;
  }

  > div {
    display: flex;
    justify-content: space-between;
    margin-top: 43px;
  }

  @media (max-width: 937px) {
    width: 611px;
  }

  @media (max-width: 611px) {
    width: 100vw;
    margin-top: 91px;
     h1 {
      margin-left: 17px;
      font-size: 30px;
    }
    > div {
      margin-top: 19px;
    }
  }
`;

export const Trending = styled.aside`
  display: flex;
  flex-direction: column;
  background: #171717;
  width: 32.1%;
  height: 406px;
  border-radius: 16px;

  h1 {
    display: flex;
    align-items: center;
    height: 65px;
    padding-left: 16px;
    font-family: "Oswald", sans-serif;
    font-size: 27px;
    color: #fff;
    border-bottom: 1px solid #4d4d4d;
  }

  div {
    display: flex;
    justify-content: center;
    position: relative;
    height: 35px;
  }

  input {
    width: 269px;
    height: 35px;
    background: #252525;
    border-radius: 8px;
    padding-left: 40px;
    border: none;
    outline-color: transparent;
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 70%;
    color: #fff;
    font-weight: 700;
    font-size: 19px;
    padding: 22px 0 30px 16px;

    li {
      margin-bottom: 10px;
    }
  }

  @media (max-width: 937px) {
    display: none;
  }
`;

export const Posts = styled.div`
  width: 65.2%;

  ul {
    width: 100%;
  }

  li {
    display: flex;
    justify-content: space-between;
    height: 237px;
    padding: 18px 18px 20px 21px;
    background: #171717;
    border-radius: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 937px) {
    width: 611px;
  }

  @media (max-width: 611px) {
    width: 100%;
  }
`;
export const Load = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  color: #6d6d6d;
  font-size: 36px;
  padding-top: 35px;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #6D6D6D;
    font-size: 30px;
    padding-top: 30px;
  }
    img{
        height: 100px;
        width: 100px;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    @media (max-width: 611px){
        font-size: 25px;
}
`;
