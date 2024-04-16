import { ICategories } from "@/types";

const SliderImages: string[] = [
  "https://img.freepik.com/free-photo/shopping-bag-cart_23-2148879372.jpg",

  "https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074076.jpg",
  "https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg",
  "https://img.freepik.com/free-photo/orange-copy-space-background-with-sale-idea_23-2148305925.jpg",
];

const ProfileButtons: any[] = [
  {
    title: "Edit profile",
    link: "/(screens)/EditProfile",
  },
  {
    title: "Update Password",
    link: "/(screens)/UpdatePassword",
  },

  {
    title: "Your smart shops",
    link: "/(screens)/ShopLists",
  },
  {
    title: "Become a Shopkeeper",
    link: "/(screens)/BecomeMerchant",
  },
  {
    title: "Help",
    link: "",
  },
  {
    title: "Career",
    link: "",
  },
  {
    title: "Ads Service",
    link: "",
  },
  {
    title: "Log out",
    link: "/(screens)/EditProfile",
  },
];

const ownersButtons: any[] = [
  {
    title: "Update Password",
    link: "/(screens)/UpdatePassword",
  },

  {
    title: "Your smart shops",
    link: "/(screens)/ShopLists",
  },

  {
    title: "Privacy Policy",
    link: "/(screens)/Help",
  },
  {
    title: "Career",
    link: "",
  },
  {
    title: "Terms & Condition",
    link: "/(screens)/Terms",
  },
];

const Categories: ICategories[] = [
  {
    id: 1,
    name: "All",
    icon: "https://cdn-icons-png.flaticon.com/512/6791/6791382.png",
  },
  {
    id: 2,
    name: "Books",
    icon: "https://cdn-icons-png.flaticon.com/512/5832/5832416.png",
  },
  {
    id: 3,
    name: "Cereals",
    icon: "https://cdn-icons-png.flaticon.com/512/9921/9921054.png",
  },
  {
    id: 4,
    name: "Cloths",
    icon: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    id: 5,
    name: "Electronics",
    icon: "https://cdn-icons-png.flaticon.com/512/3659/3659898.png",
  },
  {
    id: 6,
    name: "Sweets",
    icon: "https://cdn-icons-png.flaticon.com/512/10560/10560504.png",
  },
  {
    id: 7,
    name: "Mobiles",
    icon: "https://cdn-icons-png.flaticon.com/512/644/644458.png",
  },
  {
    id: 8,
    name: "Medicines",
    icon: "https://cdn-icons-png.flaticon.com/512/3022/3022827.png",
  },
  {
    id: 9,
    name: "Tools",
    icon: "https://cdn-icons-png.flaticon.com/512/4873/4873901.png",
  },

  {
    id: 10,
    name: "Toys",
    icon: "https://cdn-icons-png.flaticon.com/512/4841/4841216.png",
  },
];
export { SliderImages, ProfileButtons, Categories, ownersButtons };
