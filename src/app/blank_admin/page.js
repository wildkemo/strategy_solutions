"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [editingService, setEditingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New service form state
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    features: [""],
    category: "",
    icon: "box1",
  });

  // Fetch all services from backend
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://backend/app/Controllers/get_services.php"
      );
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // Optionally, fetch service requests here as well
  }, []);

  const handleRefresh = () => {
    fetchServices();
  };

  const handleAddService = () => {
    setEditingService(null);
    setNewService({
      title: "",
      description: "",
      features: [""],
      category: "",
      icon: "box1",
    });
    setShowAddModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      const response = await fetch(
        "http://backend/app/Controllers/delete_service.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: serviceId }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete service");
      await fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://backend/app/Controllers/add_service.php";
      let method = "POST";
      if (editingService) {
        url = "http://backend/app/Controllers/update_service.php";
        method = "POST";
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
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
          features: [""],
          category: "",
          icon: "box1",
        });
        await fetchServices();
      } else {
        setError(result.message || "Error in database");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...newService.features];
    newFeatures[index] = value;
    setNewService({ ...newService, features: newFeatures });
  };

  const addFeatureField = () => {
    setNewService({
      ...newService,
      features: [...newService.features, ""],
    });
  };

  const removeFeatureField = (index) => {
    const newFeatures = newService.features.filter((_, i) => i !== index);
    setNewService({ ...newService, features: newFeatures });
  };

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
                  {services.map((service) => (
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

          {/* Service Requests Card (optional, still using mock data) */}
          <div className={styles.card}>
            <h2>Recent Service Requests</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.type}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[request.status]
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td>{request.user}</td>
                      <td>{request.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              features: [""],
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
                  features: [""],
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
                  <div key={index} className={styles.featureInput}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className={styles.removeButton}
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
                      features: [""],
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
}
