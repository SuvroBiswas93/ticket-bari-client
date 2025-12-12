import React from 'react';
import { FaUserCog, FaTicketAlt, FaUsersCog, FaBullhorn } from "react-icons/fa";
import MenuItem from "./MenuItem";

const AdminMenu = () => {
    return (
        <div>
            {/* Admin Profile */}
      <MenuItem 
        icon={FaUserCog} 
        label="Admin Profile" 
        address="profile" 
      />

      {/* Manage Tickets */}
      <MenuItem 
        icon={FaTicketAlt} 
        label="Manage Tickets" 
        address="manage-tickets" 
      />

      {/* Manage Users */}
      <MenuItem 
        icon={FaUsersCog} 
        label="Manage Users" 
        address="manage-users" 
      />

      {/* Advertise Tickets */}
      <MenuItem 
        icon={FaBullhorn} 
        label="Advertise Tickets" 
        address="advertise-tickets" 
      />
        </div>
    );
};

export default AdminMenu;