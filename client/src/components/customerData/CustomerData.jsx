



import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./customerData.scss";

import {REACT_APP_BACKEND_URL} from  '../../env'

const  CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const fetchCustomers = async (page) => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/customer?page=${page}&limit=${itemsPerPage}`
      );
      const { customers, totalCount } = response.data.data;
      setCustomers(customers);
      setPageCount(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <div className="customer-pagination">
      <h2>Customer List</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< Prev"
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default  CustomerData;

