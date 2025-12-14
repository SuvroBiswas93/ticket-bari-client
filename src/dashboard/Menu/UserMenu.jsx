import { FaRegUser, FaTicketAlt, FaRegHeart } from "react-icons/fa";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  return (
    <>
      <MenuItem 
        icon={FaRegUser} 
        label="My Profile" 
        address="profile" 
      />

      <MenuItem 
        icon={FaTicketAlt} 
        label="My Booked Tickets" 
        address="my-booked-tickets" 
      />

      <MenuItem 
        icon={FaRegHeart} 
        label="Transaction History" 
        address="transaction-history" 
      />
    </>
  );
};

export default UserMenu;
