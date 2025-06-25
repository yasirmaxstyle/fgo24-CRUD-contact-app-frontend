import { User, Mail, Phone, Edit, Trash2 } from 'lucide-react'

function UserContact({ contact, openModal, deleteContact, }) {
  return (
    <div
      key={contact.id}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{contact.name}</h3>
            <p className="text-sm text-gray-400">ID: {contact.id}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{contact.phone}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => openModal(contact)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Edit className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={() => deleteContact(contact.id)}
          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default UserContact