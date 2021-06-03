import Modal from "react-modal";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

export default function ModalMap({ openMaps, setOpenMaps, post }) {
  const { geolocation } = post;
  function closeMaps() {

    setOpenMaps(false);
  }

  Modal.setAppElement(".root");
  return (
    <>
      <Modal
        className='content'
        style={customStyle}
        isOpen={openMaps}
        onRequestClose={closeMaps}
        contentLabel='Maps modal'>
        <ContainerModal>
          <div>
            <p>{post.user.username}'s location</p>
            <IoMdClose
              className='close-icon'
              onClick={() => setOpenMaps(false)}
              color='#fff'
              height='31px'
              width='31px'
            />
          </div>
          <Map>
            <p>Loading...</p>
            <iframe
              // loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?q=${geolocation.latitude},${geolocation.longitude}&key=AIzaSyAl_lBNuRGguDYVYY65rJez6TWE2XWvD-w`}></iframe>
          </Map>
        </ContainerModal>
      </Modal>
    </>
  );
}

const ContainerModal = styled.div`
  width: 790px;
  height: 354px;
  border-radius: 20px;
  background-color: #333333;
  padding: 28px 33px 33px 33px;
  top: calc(50vh - 354px / 2);
  left: calc(50vw - 790px / 2);
  > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    align-items: center;
    width: 100%;
    p {
      color: #fff;
      font-size: 32px;
      font-weight: bold;
      font-family: "Oswald", sans-serif;
    }
    .close-icon {
      cursor: pointer;
    }
    @media (max-width: 568px) {
      p {
        font-size: 25px;
      }
    }
  }
  @media (max-width: 667px) {
    width: 300px;
    p {
      font-size: 32px;
    }
  }
`;

const Map = styled.div`
  width: 100%;
  height: 240px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    z-index: 3;
    position: absolute;
    top: 10px;
    left: 300px;
  }
  iframe {
    top: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    max-width: 727px;
    height: 240px;
    margin-bottom: 23px;
    z-index: 3;
    margin: 0 auto;
    @media (max-width: 600px) {
      width: 100%;
    }
  }
  @media (max-width: 640px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    p {
      z-index: 3;
      position: absolute;
      top: calc((100% - 36px)/2);
      left: calc((100% - 36px)/2);
    }
  }
  @media (max-width: 568px) {
    p {
      font-size: 28px;
    }
  }
`;

const customStyle = {
  overlay: {
    zIndex: "4",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    display: "flex",
    marginTop: "70px",
    justifyContent: "center",
    alignItems: "center",
  },
};