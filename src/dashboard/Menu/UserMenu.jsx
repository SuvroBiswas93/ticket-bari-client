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
        label="My Tickets" 
        address="my-tickets" 
      />

      <MenuItem 
        icon={FaRegHeart} 
        label="Wishlist" 
        address="wishlist" 
      />
    </>
  );
};

export default UserMenu;
