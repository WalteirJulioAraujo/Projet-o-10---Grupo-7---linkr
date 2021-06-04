import styled from "styled-components";

export default function Repost({ConfirmRepost}) {
    return(
        <>
        <RepostStyle onClick={ConfirmRepost}>
            Repost 
            
        </RepostStyle>
        </>
    )
}

const RepostStyle = styled.div `
    cursor: pointer;
`;