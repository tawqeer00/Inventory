import React from "react";

function CustomerInfo({ customer, setCustomer }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  // Styles
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Arial', sans-serif",
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      color: "#333",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    label: {
      fontSize: "16px",
      color: "#555",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#007BFF",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Customer Information</h3>
      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={customer.name || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={customer.email || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input
            type="text"
            name="phone"
            value={customer.phone || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Address:</label>
          <input
            type="text"
            name="address"
            value={customer.address || ""}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
      </form>
    </div>
  );
}

export default CustomerInfo;
