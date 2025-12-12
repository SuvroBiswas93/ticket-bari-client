import { FaUserTie, FaPlusCircle, FaListUl, FaClipboardCheck, FaChartLine } from "react-icons/fa";
import MenuItem from "./MenuItem";
const VendorMenu = () => {
    return (
        <div>
           {/* Vendor Profile */}
      <MenuItem 
        icon={FaUserTie} 
        label="Vendor Profile" 
        address="profile" 
      />

      {/* Add Ticket */}
      <MenuItem 
        icon={FaPlusCircle} 
        label="Add Ticket" 
        address="add-ticket" 
      />

      {/* My Added Tickets */}
      <MenuItem 
        icon={FaListUl} 
        label="My Added Tickets" 
        address="my-added-tickets" 
      />

      {/* Requested Bookings */}
      <MenuItem 
        icon={FaClipboardCheck} 
        label="Requested Bookings" 
        address="requested-bookings" 
      />

      {/* Revenue Overview */}
      <MenuItem 
        icon={FaChartLine} 
        label="Revenue Overview" 
        address="revenue-overview" 
      />
        </div>
    );
};

export default VendorMenu;