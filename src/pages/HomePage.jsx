import { useState, useEffect } from 'react';
import { Plus, User, X, Check } from 'lucide-react';
import SearchContact from '../components/Search';
import UserContact from '../components/User';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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
};

export default ContactDashboard;