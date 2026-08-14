import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";
import "../css/contacts.css";

const ViewContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  // ========================================
  // Fetch Contacts
  // ========================================

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        "https://stories-by-sd.vercel.app/api/contact",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ========================================
  // Update Status
  // ========================================

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `https://stories-by-sd.vercel.app/api/contact/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === id
              ? {
                  ...contact,
                  status,
                }
              : contact,
          ),
        );

        if (selectedContact && selectedContact._id === id) {
          setSelectedContact({
            ...selectedContact,
            status,
          });
        }
      }
    } catch (error) {
      console.error("Error updating contact status:", error);

      alert("Failed to update status.");
    }
  };

  // ========================================
  // Delete Contact
  // ========================================

  const deleteContact = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact enquiry?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.delete(
        `https://stories-by-sd.vercel.app/api/contact/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== id));

        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(null);
        }

        alert("Contact enquiry deleted.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);

      alert("Failed to delete contact.");
    }
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="contactsLoading_adminContact">
          Loading contact enquiries...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="contactsPage_adminContact">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="contactsHeader_adminContact">
          <div>
            <span className="contactsMiniTitle_adminContact">
              SATYADEVA PHOTOGRAPHY
            </span>

            <h1 className="contactsTitle_adminContact">Contact Enquiries</h1>

            <p className="contactsSubtitle_adminContact">
              Manage enquiries received from your website.
            </p>
          </div>

          <div className="contactsCount_adminContact">
            <span>{contacts.length}</span>

            <small>Total Enquiries</small>
          </div>
        </div>

        {/* ========================================
            EMPTY
        ======================================== */}

        {contacts.length === 0 ? (
          <div className="contactsEmpty_adminContact">
            <h2>No Contact Enquiries</h2>

            <p>New enquiries from the Contact page will appear here.</p>
          </div>
        ) : (
          /* ========================================
              CONTACT TABLE
          ======================================== */

          <div className="contactsTableWrapper_adminContact">
            <table className="contactsTable_adminContact">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>
                      <strong>{contact.name}</strong>
                    </td>

                    <td>{contact.location}</td>

                    <td>
                      <a
                        href={`tel:${contact.phone}`}
                        className="contactPhoneLink_adminContact"
                      >
                        {contact.phone}
                      </a>
                    </td>

                    <td>
                      <div className="contactMessage_adminContact">
                        {contact.message}
                      </div>
                    </td>

                    <td>
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          updateStatus(contact._id, e.target.value)
                        }
                        className={`contactStatus_adminContact ${contact.status.toLowerCase()}`}
                      >
                        <option value="New">New</option>

                        <option value="Contacted">Contacted</option>

                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="contactActions_adminContact">
                        <button
                          type="button"
                          className="contactViewBtn_adminContact"
                          onClick={() => setSelectedContact(contact)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="contactDeleteBtn_adminContact"
                          onClick={() => deleteContact(contact._id)}
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
        )}

        {/* ========================================
            VIEW CONTACT MODAL
        ======================================== */}

        {selectedContact && (
          <div
            className="contactModalOverlay_adminContact"
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="contactModal_adminContact"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="contactModalClose_adminContact"
                onClick={() => setSelectedContact(null)}
              >
                ✕
              </button>

              <span className="contactModalLabel_adminContact">
                CONTACT ENQUIRY
              </span>

              <h2>{selectedContact.name}</h2>

              <div className="contactModalInfo_adminContact">
                <div>
                  <span>LOCATION</span>

                  <p>{selectedContact.location}</p>
                </div>

                <div>
                  <span>PHONE</span>

                  <p>
                    <a href={`tel:${selectedContact.phone}`}>
                      {selectedContact.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <span>DATE</span>

                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <span>MESSAGE</span>

                  <p className="contactModalMessage_adminContact">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="contactModalStatus_adminContact">
                <span>STATUS</span>

                <select
                  value={selectedContact.status}
                  onChange={(e) =>
                    updateStatus(selectedContact._id, e.target.value)
                  }
                >
                  <option value="New">New</option>

                  <option value="Contacted">Contacted</option>

                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewContacts;
