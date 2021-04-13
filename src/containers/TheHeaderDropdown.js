import React, {useEffect, useState} from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import {Link} from "react-router-dom"
import CIcon from '@coreui/icons-react'
import Image from "../assets/images/user.jpg"

import fire from "../firebase";
const db = fire.firestore();

const TheHeaderDropdown = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    fire.auth().onAuthStateChanged((userAuth) => {
      //console.log("logged in user: " + JSON.stringify(userAuth));
      if (userAuth != null) {
        db.collection("users").doc(userAuth.uid)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such document!");
              //setRedirectTo("/admin/locations");
            }else{
              setUser({ id: doc.id, photoUrl: doc.data().photoUrl,})
            }
          })
          .catch((err) => {
            this.setState({
              loading: false,
              //admin: false,
            });
            console.error(err);
          });
      } else {
        this.setState({
          loading: false,
          //admin: false
        });
      }
    });
  };


 const  logout = (event) => {
    fire.auth().signOut();
  };


  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
{/*           <CImg
            src={'avatars/6.jpg'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          /> */}
          <CImg
            src={
              user.photoUrl
                ? user.photoUrl
                : Image
            }
            className="c-avatar-img"
            alt=""
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />
          <Link to={"/admin/users/profile/" + user.id}>Profile</Link>
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          <span onClick={() => logout()}>Logout</span>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
