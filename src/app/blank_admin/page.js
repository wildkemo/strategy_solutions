"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [serverStatus, setServerStatus] = useState({
    cpu: 0,
    memory: 0,
    uptime: 0,
    activeUsers: 0,
  });

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

  const fetchData = async () => {
    setError(null);
    // Use mock data for service requests
    const mockServiceRequests = [
      {
        id: 1,
        type: "Maintenance",
        status: "pending",
        user: "John Doe",
        date: "2024-03-20",
      },
      {
        id: 2,
        type: "Installation",
        status: "in-progress",
        user: "Jane Smith",
        date: "2024-03-19",
      },
      {
        id: 3,
        type: "Repair",
        status: "completed",
        user: "Mike Johnson",
        date: "2024-03-18",
      },
    ];
    setServiceRequests(mockServiceRequests);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        // Replace with actual API call
        setServices(services.filter((service) => service.id !== serviceId));
      } catch (error) {
        console.error("Error deleting service:", error);
        setError("Failed to delete service. Please try again.");
      }
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update existing service
        setServices(
          services.map((service) =>
            service.id === editingService.id
              ? { ...newService, id: service.id }
              : service
          )
        );
      } else {
        // Add new service
        const newId = Math.max(...services.map((s) => s.id), 0) + 1;
        setServices([...services, { ...newService, id: newId }]);
      }
      setShowAddModal(false);
      setEditingService(null);
      setNewService({
        title: "",
        description: "",
        features: [""],
        category: "",
        icon: "box1",
      });
    } catch (error) {
      console.error("Error saving service:", error);
      setError("Failed to save service. Please try again.");
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

          {/* Service Requests Card */}
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
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
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
