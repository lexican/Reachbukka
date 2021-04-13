import React from "react";
import Skeleton from "react-loading-skeleton";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
} from "@coreui/react";
export default function OrderSkeleton() {
  return (
    <>
      {Array(4)
        .fill()
        .map((item, index) => (
          <CCard className="" id="card-item">
            <CCardHeader id="headingOne">
              <div
                block
                color="link"
                className="text-left m-0 p-0"
                //onClick={() => this.setAccordion()}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  id="lg"
                >
                  <Skeleton count={2} />
                </div>
              </div>
            </CCardHeader>
            <CCollapse show={true}>
              <CCardBody>
                <div className="">
                  <div>
                    <table className="table">
                      <thead className="primary-color">
                        <tr>
                          <th>
                            <Skeleton count={1} />
                          </th>
                          <th>
                            <Skeleton count={1} />
                          </th>
                          <th>
                            <Skeleton count={1} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><Skeleton count={1} /></td>
                          <td><Skeleton count={1} /></td>
                          <td>
                          <Skeleton count={1} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mb-2 mr-4 ml-2 p-2">
                      <div>
                        <span className="mr-1"><Skeleton count={1} /> </span>
                        <span className="mr-4"><Skeleton count={1} /></span>
                        <span className="mr-1"><Skeleton count={1} /></span>
                        <span><Skeleton count={1} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCollapse>
          </CCard>
        ))}
    </>
  );
}
