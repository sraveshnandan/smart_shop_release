import { gql } from "graphql-request";
import { gql_client } from "..";
import { ICategories, IProduct, IUser, Ishop } from "@/types";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const uploaImg = async (uri: string) => {
  try {
    // Setting up form data
    console.log("uri", uri);
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);

    formData.append("upload_preset", "secret_app");
    console.log("upload started");
    fetch(`https://api.cloudinary.com/v1_1/dirdehr7r/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload success");
        console.log("Upload successful:", data);
        const Avatar = {
          public_id: data.public_id,
          url: data.secure_url,
        };

        return Avatar;
      })
      .catch((error: any) => {
        Alert.alert("Error", "Unable to upload image.");
        console.error("Upload error:", error);
        return;
      });
  } catch (error) {}
};

const getAllCategory = (next: (category: ICategories[]) => void) => {
  const query = gql`
    query GEtALLCATEGORY {
      category {
        _id
        name
      }
    }
  `;

  gql_client
    .request(query)
    .then((res: any) => {
      return next(res.category);
    })
    .catch((e: any) => {
      console.log(e);
    });
};
const uploadImagesToCloudinary = async (imageURIs: string[]) => {
  const uploadedImages = [];

  for (const imageUrl of imageURIs) {
    try {
      console.log("Creating formdata to upload.");
      const formData = new FormData();
      formData.append("file", {
        uri: imageUrl,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
      formData.append("upload_preset", "secret_app"); // Replace with your upload preset
      console.log("making image upload response.");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dirdehr7r/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.log("Unable to upload images.");
      }

      const responseData = await response.json();
      uploadedImages.push({
        public_id: responseData.public_id,
        url: responseData.secure_url,
      });
    } catch (error) {
      console.error(`Error uploading image: ${imageUrl}`, error);
    }
  }

  return uploadedImages;
};

const fetchProfile = () => {
  AsyncStorage.getItem("token").then(async (res) => {
    console.log("token", res);
    if (res !== null) {
      const query = gql`
        query ProfileFunction {
          profile {
            message
            user {
              _id
              name
              email
              shops {
                _id
                name
                images {
                  url
                }
                address
                followers {
                  _id
                }
                products {
                  _id
                }
              }
            }
          }
        }
      `;
      await gql_client
        .setHeader("token", res)
        .request(query)
        .then((res: any) => {
          if (res.profile.user) {
            return res.profile.user;
            console.log("navigating to home page.");
            router.replace("/(tabs)/");
          } else {
            return Alert.alert("Error", "Somthing went wrong");
          }
        })
        .catch((e: any) => {
          return Alert.alert("Error", "" + e.messgae);
        });
    } else {
      Alert.alert("Token not found", "Plesae login again.");
    }
  });
};

const fetchAllProducts = async (next: (products: IProduct[]) => void) => {
  try {
    const query = gql`
      query GetAllProductFunction {
        products {
          _id
          title
          description
          images {
            url
          }
          original_price
          discount_price
          category {
            _id
            name
          }
          owner {
            _id
            name
            address
            owner {
              _id
              avatar {
                url
              }
            }
          }
          views
          ratings
          likes {
            _id
          }
          extra {
            name
            value
          }
        }
      }
    `;

    await gql_client
      .request(query)
      .then((res: any) => {
        const allProducts = res.products;
        return next(allProducts);
      })
      .catch((e) => console.log(e));
  } catch (error: any) {
    return alert(error.message);
  }
};

const LikeAndUnlikeProduct = async (id: string) => {
  try {
    const query = gql`
      mutation LIKeUnlike($pId: ID!) {
        likeProduct(productId: $pId)
      }
    `;
    const variables = {
      pId: id,
    };

    await gql_client
      .request(query, variables)
      .then((res: any) => {
        return Alert.alert("Success");
      })
      .catch((e: any) => {
        return Alert.alert("Error", `${e.message}`);
      });
  } catch (error: any) {
    Alert.alert("Error", "" + error.message);
  }
};

const fetchAllShops = async (next: (shops: Ishop[]) => void) => {
  try {
    const query = gql`
      query GetAllShops {
        shops {
          _id
          name
          description
          address
          images {
            url
          }
          owner {
            _id
            name
            email
            avatar {
              url
            }
            phone_no
          }
          followers {
            _id
            name
            avatar {
              url
            }
            email
          }
          products {
            _id
            title
            discount_price
            images {
              url
            }
          }
        }
      }
    `;

    await gql_client
      .request(query)
      .then((res: any) => {
        const allShops = res.shops;
        return next(allShops);
      })
      .catch((e) => console.log(e));
  } catch (error: any) {
    return alert(error.message);
  }
};

const FetchAllUsers = async (next: (users: IUser[]) => void) => {
  try {
    const query = gql`
      query GETALLUSERS {
        users {
          _id
          email
          name
          avatar {
            public_id
            url
          }
          phone_no
          isAdmin
          isShopOwner
          createdAt
          shops {
            _id
          }
          updatedAt
        }
      }
    `;
    gql_client
      .request(query)
      .then((res: any) => {
        return next(res.users);
      })
      .catch((e: any) => {
        console.log(e);
      });
  } catch (error: any) {
    console.log(error.message);
  }
};

export {
  fetchAllProducts,
  fetchAllShops,
  fetchProfile,
  LikeAndUnlikeProduct,
  uploaImg,
  uploadImagesToCloudinary,
  getAllCategory,
  FetchAllUsers,
};
