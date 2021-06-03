import Modal from "react-modal";
import styled from "styled-components";
import { Close, LocationSharp } from "react-ionicons";
import GoogleMapReact from "google-map-react";

export default function ModalMaps({ openMaps, setOpenMaps, post}) {
  const { geolocation } = post;
  function closeMaps() {
    setOpenMaps(false);
  }

  Modal.setAppElement(".root");
  return (
    <>
      <Modal
        className="content"
        style={customStyle}
        isOpen={openMaps}
        onRequestClose={closeMaps}
        contentLabel="Maps modal"
      >
        <ContainerModal>
          <div>
            <p>{post.user.username}'s location</p>
            <Close
              className="close-icon"
              onClick={() => setOpenMaps(false)}
              color="#fff"
              height="31px"
              width="31px"
            />
          </div>
          <Map>
            <GoogleMapReact
              key=""
              defaultCenter={{
                lat: parseFloat(geolocation.latitude),
                lng: parseFloat(geolocation.longitude),
              }}
              defaultZoom={12}
            >
              <LocationSharp
                color="#EA4335"
                height="40px"
                width="40px"
                lat={geolocation.latitude}
                lng={geolocation.longitude}
              />
       <div style={{width:'100vh', height='100vh'}}>
       <WrappedMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&Key=AIzaSyCzJiSs5Hd1Xe2S_KRF65rmBCZuH7tj_A8"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}/>
       </div>
            </GoogleMapReact>
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
  position: fixed;
  top: calc(50vh - 354px / 2);
  left: calc(50vw - 790px / 2);
  > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    p {
      color: #fff;
      font-size: 36px;
      font-weight: bold;
      font-family: "Oswald", sans-serif;
    }
    .close-icon {
      cursor: pointer;
    }
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Map = styled.div`
  width: 100%;
  height: 240px;
`;

const customStyle = {
  overlay: {
    zIndex: "11",
    position: "fixed",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
};