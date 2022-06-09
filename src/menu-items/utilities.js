// assets
import { IconUsers, IconBuildingStore, IconUserPlus } from "@tabler/icons";

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconUserPlus,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: "admin-utilities",
  title: "Admin Features",
  type: "group",
  children: [
    {
      id: "userlist",
      title: "User List",
      type: "item",
      url: "/admin/userlist",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    {
      id: "blacklistvendor",
      title: "Vendor List",
      type: "item",
      url: "/admin/blacklistvendor",
      icon: icons.IconBuildingStore,
      breadcrumbs: false,
    },
    {
      id: "blacklistreq",
      title: "Requests",
      type: "item",
      url: "/admin/blacklistreq",
      icon: icons.IconUserPlus,
      breadcrumbs: false,
    },
    // {
    //     id: 'icons',
    //     title: 'Icons',
    //     type: 'collapse',
    //     icon: icons.IconWindmill,
    //     children: [
    //         {
    //             id: 'tabler-icons',
    //             title: 'Tabler Icons',
    //             type: 'item',
    //             url: '/icons/tabler-icons',
    //             breadcrumbs: false
    //         },
    //         {
    //             id: 'material-icons',
    //             title: 'Material Icons',
    //             type: 'item',
    //             url: '/icons/material-icons',
    //             breadcrumbs: false
    //         }
    //     ]
    // }
  ],
};

export default utilities;
