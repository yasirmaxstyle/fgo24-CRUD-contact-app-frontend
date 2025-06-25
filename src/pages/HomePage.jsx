import { useState, useEffect } from 'react';
import { Plus, User, X, Check } from 'lucide-react';
import SearchContact from '../components/Search';
import UserContact from '../components/User';
import AddUser from '../components/AddUser';

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const API_BASE = 'http://localhost:8080';

  useEffect(() => {
    loadContacts();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/contacts`);
      const data = await response.json();
      console.log(data)
      setContacts(data.contacts || []);
    } catch (error) {
      showMessage('Error loading contacts: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchContact = async () => {
    if (!searchId.trim()) {
      showMessage('Please enter a contact ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/contacts/${searchId}`);
      if (!response.ok) {
        throw new Error('Contact not found');
      }
      const contact = await response.json();
      setContacts([contact]);
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      });
    } else {
      setEditingContact(null);
      setFormData({ name: '', email: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const saveContact = async (e) => {
    e.preventDefault();

    const url = editingContact
      ? `${API_BASE}/contacts/${editingContact.id}`
      : `${API_BASE}/contacts`;

    const method = editingContact ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.message) {
        showMessage(data.message, 'success');
        closeModal();
        loadContacts();
      } else if (data.error) {
        showMessage('Error: ' + data.error, 'error');
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.message) {
        showMessage(data.message, 'success');
        loadContacts();
      } else if (data.error) {
        showMessage('Error: ' + data.error, 'error');
      }
    } catch (error) {
      showMessage('Error: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {message.text && (
        <div className={`max-w-7xl mx-auto px-4 py-3 rounded-lg ${message.type === 'success'
          ? 'bg-green-900 border border-green-700 text-green-100'
          : 'bg-red-900 border border-red-700 text-red-100'
          }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Section */}
          <SearchContact
            setSearchId={setSearchId}
            searchContact={searchContact}
            loadContacts={loadContacts}
            searchId={searchId} />
          {/* Add Contact Button */}
          <button
            onClick={() => openModal()}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No contacts found</p>
            <p className="text-gray-500 mt-2">Add your first contact to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <UserContact
                contact={contact}
                openModal={openModal}
                deleteContact={deleteContact}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddUser
          editingContact={editingContact}
          closeModal={closeModal}
          saveContact={saveContact}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default ContactDashboard;