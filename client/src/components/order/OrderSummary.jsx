import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../env";
import Card from "../cards/Card";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  ArcElement
);

const OrderSummary = () => {
  const [chartData, setChartData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("completed");
  const [pieData, setPieData] = useState(null);

  const fetchMonthlyOrders = async (status) => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/customer/orders/orders-by-month?status=${status}`
      );
      const { ordersByMonth } = response.data;

      const labels = ordersByMonth.map((item) => item.month.slice(0, 3));
      const data = ordersByMonth.map((item) => item.orderCount);

      setChartData({
        labels,
        datasets: [
          {
            label: `Monthly Orders (${
              status.charAt(0).toUpperCase() + status.slice(1)
            })`,
            data,
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "#4CAF50",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching monthly orders:", error);
    }
  };

  const fetchOrderStatusCounts = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/customer/orders/orders-status-counts`
      );
      const { statusCounts, totalOrders } = response.data;

      setPieData({
        labels: ["Completed", "Pending", "Cancelled"],
        datasets: [
          {
            data: [statusCounts.completed, statusCounts.pending, statusCounts.cancelled],
            backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching order status counts:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyOrders(filterStatus);
    fetchOrderStatusCounts();
  }, [filterStatus]);

  if (!chartData || !pieData) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "100%",
       
        marginBottom: "2rem",
        marginTop: "4rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Flex container for charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        //   alignItems: "flex-start",
          gap: "10px",
        //   backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "1rem",
          
          
      
          
        }}
      >
        <div>
                    {/* Line Chart */}
        <div style={{ flex: 2 , backgroundColor: "#fff",width:"510px", height:"360px",borderRadius: "8px", }}>
          
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `Monthly Orders - ${
                    filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)
                  }`,
                  font: { size: 16, weight: "bold", family: "Arial, sans-serif" },
                  color: "#555",
                },
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: "#555" },
                  grid: { display: false },
                },
                y: {
                  ticks: { color: "#555" },
                  grid: { display: false },
                },
              },
            }}
          />
       
          
    {/* Filter Buttons */}
    <div
      style={{

       
        display: "flex",
        justifyContent:"center",
        marginTop:"3.5rem",
        gap:"10px"
        

      }}
    >
      {["completed", "pending", "cancelled"].map((status) => (
        <button
          key={status}
          onClick={() => setFilterStatus(status)}
          style={{
            padding: "6px 12px",
            fontSize: "0.85rem",
            fontWeight: "bold",
            color: filterStatus === status ? "#fff" : "#007bff",
            backgroundColor:
              filterStatus === status ? "#007bff" : "transparent",
            border: `1px solid #007bff`,
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
        </div>

    
          
        </div>
  
        {/* Pie Chart */}
        <div
          style={{
        
       
            border: "1px solid #ddd",
            borderRadius: "8px",
            // PaddingLeft:"8rem",  
            backgroundColor: "#fff",
           
            
            
          
           
            
          }}
        >
            <div style={{width:"500px", height:"340px",paddingBottom:"3.5rem",    display:"flex",
            alignItems:"center",flexDirection:"column"}}>          
            <h3 style={{ marginTop:"1rem"}}>Total Order Status</h3>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },

              },
            }}
          />
          </div>

        </div>
      </div>

    </div>
  );
};

export default OrderSummary;
