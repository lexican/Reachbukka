import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CPagination
  } from '@coreui/react'

export default class pagination extends Component {

  render() {
   const {currentPage, numberOfPages, setCurrentPage } = this.props;

    return (
      <div>
        <CCard>
          <CCardBody>
            <CPagination
              align="center"
              addListClass="some-class"
              activePage={currentPage}
              pages={numberOfPages}
              onActivePageChange={setCurrentPage}
            />
          </CCardBody>
        </CCard>
      </div>
    );
  }
}
