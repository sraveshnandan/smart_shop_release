export interface ICategories {
  id?: number;
  _id?: string;
  createdBy?: IUser;
  name: string;
  icon?: string;
}

export interface IReview {
  _id: string;
  user?: IUser;
  star?: number;
  message?: string;
}

export interface IProduct {
  _id: string;
  title?: string;
  description?: string;
  images: [
    {
      public_id?: string;
      url?: string;
    }
  ];
  category?: [ICategories];
  original_price?: number;
  discount_price?: number;
  ratings?: number;
  reviews: [IReview];
  extra?: [
    {
      name?: string;
      value?: string;
    }
  ];
  owner: Ishop;
  likes: [IUser];
  views?: number;
}

export interface IUser {
  _id: string;
  name?: string;
  email?: string;
  avatar: {
    public_id?: string;
    url: string;
  };
  shops: [Ishop];
  isShopOwner?: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Ishop {
  _id: string;
  name?: string;
  description?: string;
  images?: [
    {
      public_id?: string;
      url?: string;
    }
  ];
  products?: [IProduct];
  owner?: IUser;
  followers?: [IUser];
  location?: {
    lat: number;
    long: number;
  };
  views?: number;
  address?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone_no?: number;
  avatar?: {
    public_id: string;
    url: string;
  };
}
