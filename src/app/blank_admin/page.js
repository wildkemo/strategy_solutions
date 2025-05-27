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
        "http://localhost/strategy_solutions_backend/app/Models/Customer.php",
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
        alert(result.message);
      } else {
        alert(result.message);
      }
      await fetchServices();
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
      if (editingService) {
        url =
          "http://localhost/strategy_solutions_backend/app/Controllers/update_service.php";
        // url = "http://localhost/www/oop_project/php_backend/app/Controllers/update_service.php";
        method = "POST";
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
        alert(result.message);
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
  const filteredServices = services.filter((service) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      service.title.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      (service.features &&
        service.features.some((f) =>
          (f.name + " " + f.description).toLowerCase().includes(term)
        ))
    );
  });
  const filteredServiceRequests = serviceRequests.filter((request) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (request.id + "").includes(term) ||
      (request.name && request.name.toLowerCase().includes(term)) ||
      (request.email && request.email.toLowerCase().includes(term)) ||
      (request.phone && request.phone.toLowerCase().includes(term)) ||
      (request.company_name &&
        request.company_name.toLowerCase().includes(term)) ||
      (request.service_type &&
        request.service_type.toLowerCase().includes(term)) ||
      (request.service_description &&
        request.service_description.toLowerCase().includes(term)) ||
      (request.status && request.status.toLowerCase().includes(term))
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
            {users && users.length > 0 && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem 1.25rem",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                  color: "#222",
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ marginRight: "2rem" }}>
                  <strong>Name:</strong> {users[0].name}
                </span>
                <span style={{ marginRight: "2rem" }}>
                  <strong>Email:</strong> {users[0].email}
                </span>
                <span style={{ marginRight: "2rem" }}>
                  <strong>Company:</strong> {users[0].company_name}
                </span>
                <span>
                  <strong>Phone:</strong> {users[0].phone}
                </span>
              </div>
            )}
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
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.company_name}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user.gender}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
                      required
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
