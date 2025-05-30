"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./admin.module.css";

const validateSession = async () => {
  // const response2 = await fetch(
  // "http://localhost/oop_project/php_backend/app/Controllers/route.php",
  //  {headers: { 'Content-Type': 'application/json' } ,credentials: 'include'})

  const response2 = await fetch(
    "http://localhost/strategy_solutions_backend/app/Controllers/route.php",
    // "http://localhost/www/oop_project/php_backend/app/Controllers/route.php",
    { headers: { "Content-Type": "application/json" }, credentials: "include" }
  );

  if (!response2.ok) throw new Error("Failed to fetch services");

  let result = await response2.json();

  if (result.status != "success") {
    return false;
    throw new Error("Permission required");
  } else {
    return true;
  }
};

function PopupNotification({ message, onClose, success = true }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.3)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: success ? "#0070f3" : "#e74c3c",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: success
            ? "0 4px 24px rgba(0,112,243,0.18)"
            : "0 4px 24px rgba(231,76,60,0.18)",
          border: success ? "1.5px solid #0070f3" : "1.5px solid #e74c3c",
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          position: "relative",
          animation: "fadeIn 0.7s",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            background: "none",
            border: "none",
            fontSize: 22,
            color: success ? "#0070f3" : "#e74c3c",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 12 }}>{success ? "Success" : "Deleted"}</h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const valid = await validateSession();
        if (!valid) {
          window.location.href = "/"; // or handle it however you want
        }
      } catch (err) {
        console.error(err);
        window.location.href = "/services/page.js"; // redirect on failure
      }
    };

    checkSession();
  }, []);

  // if(validateSession() == true){

  const [serviceRequests, setServiceRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New service form state
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    features: [{ name: "", description: "" }],
    category: "",
    icon: "box1",
  });

  const [statusDropdown, setStatusDropdown] = useState({
    open: false,
    requestId: null,
  });
  const statusButtonRefs = useRef({});
  const statusDropdownRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });

  // Helper to normalize features array
  function normalizeFeatures(features) {
    if (!Array.isArray(features)) return [];
    return features.map((f) =>
      typeof f === "string"
        ? { name: f, description: "" }
        : { name: f.name || "", description: f.description || "" }
    );
  }

  // Fetch all services from backend
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/get_services.php"
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_services.php"
      );
      if (!response.ok) throw new Error("Failed to fetch services");
      let data = await response.json();
      // Normalize features for all services
      data = data.map((service) => ({
        ...service,
        features: normalizeFeatures(service.features),
      }));
      setServices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all service requests from backend
  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/get_orders.php"
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_orders.php"
      );
      if (!response.ok) throw new Error("Failed to fetch service requests");
      const data = await response.json();
      setServiceRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch all users from backend
  const fetchUsers = async () => {
    setIsUsersLoading(true);
    setUsersError(null);
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/get_users.php",
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServiceRequests();
    fetchUsers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        statusDropdown.open &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdown({ open: false, requestId: null });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusDropdown]);

  const handleRefresh = () => {
    fetchServices();
  };

  const handleAddService = () => {
    setEditingService(null);
    setNewService({
      title: "",
      description: "",
      features: [{ name: "", description: "" }],
      category: "",
      icon: "box1",
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = async (ID, EMAIL) => {
    const response = await fetch(
      "http://localhost/strategy_solutions_backend/app/Controllers/delete_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ID, email: EMAIL }),
      }
    );
    if (!response.ok) throw new Error("Failed to delete service");
    const result = await response.json();
    if (result.status == "success") {
      setPopup({ show: true, message: "User deleted.", success: false });
    } else {
      alert(result.message);
    }
    await fetchUsers();
    await fetchServiceRequests();
    await fetchServices();
  };

  const handleEditService = (service) => {
    setEditingService(service);
    // Normalize features
    const features = normalizeFeatures(service.features);
    setNewService({ ...service, features });
    setShowAddModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/delete_service.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/delete_service.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: serviceId }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete service");
      const result = await response.json();
      if (result.status == "success") {
        setPopup({ show: true, message: "Service deleted.", success: false });
        await fetchServices();
      } else {
        alert(result.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      let url =
        "http://localhost/strategy_solutions_backend/app/Controllers/add_service.php";
      // let url = "hhttp://localhost/www/oop_project/php_backend/app/Controllers/add_service.php";
      let method = "POST";
      let isEdit = false;
      if (editingService) {
        url =
          "http://localhost/strategy_solutions_backend/app/Controllers/update_service.php";
        // url = "http://localhost/www/oop_project/php_backend/app/Controllers/update_service.php";
        method = "POST";
        isEdit = true;
      }
      // Always send features as array of objects
      const features = normalizeFeatures(newService.features);
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          features,
          id: editingService ? editingService.id : undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to save service");
      const result = await response.json();
      if (result.status === "success") {
        setShowAddModal(false);
        setEditingService(null);
        setNewService({
          title: "",
          description: "",
          features: [{ name: "", description: "" }],
          category: "",
          icon: "box1",
        });
        await fetchServices();
        if (isEdit) {
          setPopup({
            show: true,
            message: `Service '${newService.title}' edited successfully.`,
            success: true,
          });
        } else {
          setPopup({
            show: true,
            message: `Service '${newService.title}' added successfully.`,
            success: true,
          });
        }
      } else {
        alert(result.message);
        setError(result.message || "Error in database");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...newService.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setNewService({ ...newService, features: newFeatures });
  };

  const addFeatureField = () => {
    setNewService({
      ...newService,
      features: [...newService.features, { name: "", description: "" }],
    });
  };

  const removeFeatureField = (index) => {
    const newFeatures = newService.features.filter((_, i) => i !== index);
    setNewService({ ...newService, features: newFeatures });
  };

  const handleStatusButtonClick = (requestId) => {
    setStatusDropdown((prev) => ({
      open: prev.requestId !== requestId || !prev.open,
      requestId,
    }));
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const response = await fetch(
      "http://localhost/strategy_solutions_backend/app/Controllers/update_order_status.php",
      // "http://localhost/www/oop_project/php_backend/app/Controllers/update_order_status.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: newStatus }),
      }
    );
    if (!response.ok) throw new Error("Failed to update status");
    const result = await response.json();
    if (result.status === "success") {
      alert(result.message);
    } else {
      alert(result.message);
    }
    await fetchServiceRequests();
    setStatusDropdown({ open: false, requestId: null });
  };

  // Filtered data based on search
  const term = searchTerm.toLowerCase();
  const matches = (value) =>
    value && value.toString().toLowerCase().includes(term);

  const filteredServices = services.filter((service) => {
    if (!term) return true;
    return (
      matches(service.id) ||
      matches(service.title) ||
      matches(service.category) ||
      (service.features &&
        service.features.some((f) => matches(f.name) || matches(f.description)))
    );
  });

  const filteredServiceRequests = serviceRequests.filter((request) => {
    if (!term) return true;
    return (
      matches(request.id) ||
      matches(request.name) ||
      matches(request.email) ||
      matches(request.phone) ||
      matches(request.company_name) ||
      matches(request.service_type) ||
      matches(request.service_description) ||
      matches(request.status)
    );
  });

  const filteredUsers = users.filter((user) => {
    if (!term) return true;
    return (
      matches(user.id) ||
      matches(user.name) ||
      matches(user.email) ||
      matches(user.phone) ||
      matches(user.company_name) ||
      matches(user.gender)
    );
  });

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className={styles.refreshButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {popup.show && (
        <PopupNotification
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", success: true })}
          success={popup.success}
        />
      )}
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.headerControls}>
          <input
            type="text"
            placeholder="Search all data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "1rem",
              marginRight: "1rem",
              minWidth: 200,
            }}
          />
          <div className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  "http://localhost/strategy_solutions_backend/app/Controllers/logout.php",
                  // "http://localhost/www/oop_project/php_backend/app/Controllers/logout.php",
                  {
                    method: "POST",
                    credentials: "include",
                  }
                );
                if (!response.ok) throw new Error("Logout failed");
                window.location.href = "/";
              } catch (err) {
                console.error(err);
                alert("Logout failed. Please try again.");
              }
            }}
            className={styles.refreshButton}
          >
            Logout
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading dashboard data...</div>
      ) : (
        <div className={styles.grid}>
          {/* Service Management Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Service Management</h2>
              <button onClick={handleAddService} className={styles.addButton}>
                Add New Service
              </button>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Features</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.title}</td>
                      <td>{service.category}</td>
                      <td>{service.features.length} features</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEditService(service)}
                            className={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Requests Card (now dynamic from backend) */}
          <div className={styles.card}>
            <h2>Recent Service Requests</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company Name</th>
                    <th>Service Type</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServiceRequests.map((request) => (
                    <tr key={request.id}>
                      <td data-label="ID">{request.id}</td>
                      <td data-label="Name">{request.name}</td>
                      <td data-label="Email">{request.email}</td>
                      <td data-label="Phone">{request.phone}</td>
                      <td data-label="Company Name">{request.company_name}</td>
                      <td data-label="Service Type">{request.service_type}</td>
                      <td data-label="Description">
                        {request.service_description}
                      </td>
                      <td data-label="Status" style={{ position: "relative" }}>
                        <button
                          ref={(el) =>
                            (statusButtonRefs.current[request.id] = el)
                          }
                          className={styles.statusButton}
                          data-status={request.status}
                          style={{
                            background:
                              request.status === "Pending"
                                ? "#f1c40f"
                                : request.status === "Active"
                                ? "#0984e3"
                                : request.status === "Declined"
                                ? "#d63031"
                                : request.status === "Done"
                                ? "#00b894"
                                : "#b2bec3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontWeight: 600,
                            minWidth: 90,
                          }}
                          onClick={() => handleStatusButtonClick(request.id)}
                        >
                          {request.status}
                        </button>
                        {statusDropdown.open &&
                          statusDropdown.requestId === request.id && (
                            <div
                              className={styles.statusDropdown}
                              ref={statusDropdownRef}
                            >
                              {["Active", "Declined", "Done"].map((option) => (
                                <button
                                  key={option}
                                  className={styles.statusDropdownOption}
                                  onClick={() =>
                                    handleStatusChange(request.id, option)
                                  }
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management Card */}
          <div className={`${styles.card} ${styles.userCard}`}>
            <h2>User Management</h2>
            {filteredUsers && filteredUsers.length > 0 && null}
            {isUsersLoading ? (
              <div className={styles.loading}>Loading users...</div>
            ) : usersError ? (
              <div className={styles.error}>{usersError}</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id || user.email || user.name}>
                        <td>{user.name}</td>
                        <td>{user.company_name}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user.gender}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.email)
                            }
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowAddModal(false);
            setEditingService(null);
            setNewService({
              title: "",
              description: "",
              features: [{ name: "", description: "" }],
              category: "",
              icon: "box1",
            });
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => {
                setShowAddModal(false);
                setEditingService(null);
                setNewService({
                  title: "",
                  description: "",
                  features: [{ name: "", description: "" }],
                  category: "",
                  icon: "box1",
                });
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
            <form onSubmit={handleServiceSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) =>
                    setNewService({ ...newService, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({ ...newService, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Icon Style</label>
                <select
                  value={newService.icon}
                  onChange={(e) =>
                    setNewService({ ...newService, icon: e.target.value })
                  }
                >
                  <option value="box1">Box 1</option>
                  <option value="box2">Box 2</option>
                  <option value="box3">Box 3</option>
                  <option value="box4">Box 4</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Features</label>
                {newService.features.map((feature, index) => (
                  <div
                    key={index}
                    className={styles.featureInput}
                    style={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Feature Name"
                      value={feature.name}
                      onChange={(e) =>
                        handleFeatureChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <textarea
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      style={{ minHeight: "60px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className={styles.removeButton}
                      style={{ alignSelf: "flex-end" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeatureField}
                  className={styles.addFeatureButton}
                >
                  Add Feature
                </button>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  {editingService ? "Update Service" : "Add Service"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                    setNewService({
                      title: "",
                      description: "",
                      features: [{ name: "", description: "" }],
                      category: "",
                      icon: "box1",
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  // }
}
