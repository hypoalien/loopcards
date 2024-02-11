import React, { useState, useEffect } from "react";
import axios from "../utility/axios";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Loader from "./Loader";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import {
  platforms,
  linkFormat,
  capitalizeWords,
  formatPhoneNumber,
  reformatPhoneNumber,
} from "../utility/misc";

export default function EditPage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [bannerPicture, setBannerPicture] = useState(null);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [company, setcompany] = useState("");
  const [title, settitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [website, setwebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [emailPublic, setEmail] = useState("");
  const [links, setLinks] = useState([]);

  const [bannerPhoto, setBannerPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [profileUrl, setProfileUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  const [profile, setProfile] = useState(null);
  const AuthAxios = useAuthHeader();
  const token = AuthAxios();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add a loading state
  console.log(firstname);
  // const {newUser}=route.params
  // Fetch user's profile data from API
  useEffect(() => {
    async function getProfileInfo() {
      try {
        const response = await axios.post(
          "/users/getUserProfilePrivate",
          null,
          {
            headers: {
              authorization: token,
            },
          },
        );
        if (response.data) {
          setProfile(response.data);
          setFirstName(response.data.firstname);
          setLastName(response.data.lastname);
          setcompany(response.data.company);
          settitle(response.data.title);
          setHeadline(response.data.headline);
          setAbout(response.data.about);
          setwebsite(response.data.website);
          setPhone(response.data.phone);
          setEmail(response.data.emailPublic);
          setLinks(response.data.socialLinks);
          setProfileUrl(response.data.profileUrl);
          setBannerUrl(response.data.bannerUrl);
        }
      } catch (error) {
        // handle error
        console.error(error);
      }
    }
    getProfileInfo();
  }, []);

  const handleProfileChange = (event) => {
    console.log("inside profile change", event.target.files);
    setProfilePicture(event.target.files[0]);
    setProfilePhoto(event.target.files[0]);
  };
  const handleBannerChange = (event) => {
    console.log("inside cover change", event.target.files);
    setBannerPicture(event.target.files[0]);
    setBannerPhoto(event.target.files[0]);
  };
  useEffect(() => {
    if (bannerPhoto) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setBannerUrl(fileReader.result);
      };
      fileReader.readAsDataURL(bannerPhoto);
    }
  }, [bannerPhoto]);

  useEffect(() => {
    if (profilePhoto) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setProfileUrl(fileReader.result);
      };
      fileReader.readAsDataURL(profilePhoto);
    }
  }, [profilePhoto]);

  const handleSubmit = async (event) => {
    setIsLoading(true);

    event.preventDefault();
    // setLinks(formatUrls(links))
    console.log("clicked", links);
    const form = event.target;

    var formData = new FormData(form);
    var formProfileData = new FormData();
    var formBannerData = new FormData();
    console.log("firstname", firstname);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("company", company);
    formData.append("title", title);
    formData.append("headline", headline);
    formData.append("about", about);
    formData.append("website", website);
    formData.append("emailPublic", emailPublic);
    formData.append("phone", reformatPhoneNumber(phone));
    formData.append("socialLinks", JSON.stringify(links));
    if (profilePicture) {
      console.log("inside profile picture");
      formProfileData.append(
        "profilePicture",
        profilePicture,
        profilePicture.name,
      );
    }
    if (bannerPicture) {
      console.log("inside profile picture");
      formBannerData.append("bannerPicture", bannerPicture, bannerPicture.name);
    }

    for (const [name, value] of formData.entries()) {
      console.log(name + ": " + value);
    }
    try {
      var reqBody = Object.fromEntries(formData.entries());
      reqBody.socialLinks = JSON.parse(reqBody.socialLinks);
      console.log("req body", reqBody);

      const response = await axios.post("/users/UpdateUserProfile", reqBody, {
        headers: {
          // "Content-Type": "multipart/form-data",
          authorization: token,
        },
      });

      if (response) {
        console.log({ data: response.data, success: true });
      }

      if (profilePicture) {
        const uploadImageResponse = await axios.post(
          "/users/uploadProfile",
          formProfileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: token,
            },
          },
        );
        if (uploadImageResponse) {
          console.log({ data: uploadImageResponse.data, success: true });
        }
      }
      if (bannerPicture) {
        const uploadImageResponse = await axios.post(
          "/users/uploadBanner",
          formBannerData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: token,
            },
          },
        );
        if (uploadImageResponse) {
          console.log({ data: uploadImageResponse.data, success: true });
        }
      }
      navigate("/home");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    const newLink = {
      platform: platforms[0],
      url: "",
      username: "",
    };
    setLinks([...links, newLink]);
  };

  const handleDelete = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const handlePlatformChange = (index, event) => {
    const updatedLinks = [...links];
    updatedLinks[index].platform = event.target.value;
    const platform = updatedLinks[index].platform.toLowerCase(); // convert to lowercase for matching
    const urlFormat = linkFormat[platform].url; // get the corresponding URL format for the platform
    const getUsername = updatedLinks[index].username;
    const username = getUsername.replace(/\s+/g, ""); // remove any spaces from the name field
    updatedLinks[index].url = urlFormat.replace("{{username}}", username);
    setLinks(updatedLinks);
  };

  const handleUrlChange = (index, event) => {
    const updatedLinks = [...links];
    updatedLinks[index].username = event.target.value;
    const platform = updatedLinks[index].platform.toLowerCase(); // convert to lowercase for matching
    const urlFormat = linkFormat[platform].url; // get the corresponding URL format for the platform
    const getUsername = updatedLinks[index].username;
    const username = getUsername.replace(/\s+/g, ""); // remove any spaces from the name field
    updatedLinks[index].url = urlFormat.replace("{{username}}", username);
    setLinks(updatedLinks);
  };

  if (!profile) {
    return <Loader />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <container>
      <form
        className="space-y-8 divide-y px-10 divide-gray-200"
        onSubmit={handleSubmit}>
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-zinc-200">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            {/* profile Picture */}
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="profile-photo"
                  className="block text-sm font-medium text-zinc-200">
                  {profileUrl ? (
                    <label
                      htmlFor="profilePicture"
                      className="relative cursor-pointer  rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                      <span>Change Photo</span>
                      <input
                        id="profilePicture"
                        name="profilePicture"
                        type="file"
                        className="sr-only"
                        onChange={handleProfileChange}
                      />
                    </label>
                  ) : (
                    "Profile photo"
                  )}
                </label>
                <div className="mt-1 flex justify-center h-48 w-48 px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-full ">
                  {profileUrl ? (
                    <img
                      src={profileUrl}
                      alt="Preview"
                      className="h-36 w-36 object-cover rounded-full"
                    />
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 items-center justify-center">
                        <label
                          htmlFor="profilePicture"
                          className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                          <span>Upload a file</span>
                          <input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            className="sr-only"
                            onChange={handleProfileChange}
                          />
                        </label>
                      </div>

                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="banner-photo"
                  className="block text-sm font-medium text-zinc-200">
                  {bannerUrl ? (
                    <label
                      htmlFor="bannerPicture"
                      className="relative cursor-pointer  rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                      <span>Change Photo</span>
                      <input
                        id="bannerPicture"
                        name="bannerPicture"
                        type="file"
                        className="sr-only"
                        onChange={handleBannerChange}
                      />
                    </label>
                  ) : (
                    "Cover photo"
                  )}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-md">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="bannerPicture"
                          className="relative cursor-pointer  rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                          <span>Upload a file</span>
                          <input
                            id="bannerPicture"
                            name="bannerPicture"
                            type="file"
                            className="sr-only"
                            onChange={handleBannerChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-zinc-200">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={firstname ? firstname : ""}
                    name="firstname"
                    id="firstname"
                    autoComplete="given-name"
                    required
                    onChange={(e) =>
                      setFirstName(capitalizeWords(e.target.value))
                    }
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200  border-zinc-700 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-zinc-200">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    required
                    value={lastname}
                    type="text"
                    name="lastname"
                    id="lastname"
                    autoComplete="family-name"
                    onChange={(e) =>
                      setLastName(capitalizeWords(e.target.value))
                    }
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm text-zinc-200 bg-zinc-900  border-zinc-700 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-zinc-200">
                  Company/Collage
                </label>
                <div className="mt-1">
                  <input
                    required
                    type="text"
                    value={company}
                    name="company"
                    id="company"
                    autoComplete="family-name"
                    onChange={(e) =>
                      setcompany(capitalizeWords(e.target.value))
                    }
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-zinc-200">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    required
                    type="text"
                    placeholder="CEO/Student/Developer"
                    value={title}
                    name="title"
                    id="title"
                    autoComplete="family-name"
                    onChange={(e) => settitle(capitalizeWords(e.target.value))}
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-zinc-200">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="website"
                    value={website}
                    id="website"
                    placeholder="www.example.com"
                    autoComplete="family-name"
                    onChange={(e) => setwebsite(e.target.value)}
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-zinc-200">
                  About
                </label>
                <div className="mt-1">
                  <textarea
                    id="about"
                    name="about"
                    value={about}
                    rows={3}
                    onChange={(e) => setAbout(capitalizeWords(e.target.value))}
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences about yourself.
                </p>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-200">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    required
                    id="email"
                    value={emailPublic}
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-zinc-200">
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    required
                    id="phone"
                    value={formatPhoneNumber(phone)}
                    name="phone"
                    placeholder="555-555-5555"
                    autoComplete="phone"
                    type="tel"
                    onChange={(e) =>
                      setPhone(formatPhoneNumber(e.target.value))
                    }
                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block py-2 text-sm font-medium text-zinc-200">
                  Add your Social Media Usernames
                </label>
                {links?.map((link, index) => (
                  <div key={index} className="my-2">
                    <div className="flex items-center">
                      <select
                        value={link.platform}
                        onChange={(event) => handlePlatformChange(index, event)}
                        className=" bg-zinc-900 text-zinc-200 max-w-16 block focus:ring-teal-500 focus:border-teal-500 w-half mb-2 shadow-sm sm:max-w-xs sm:text-sm border-zinc-700 rounded-md">
                        {platforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={link.username}
                        onChange={(event) => handleUrlChange(index, event)}
                        className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm bg-zinc-900 text-zinc-200 border-zinc-700 rounded-md"
                      />
                      <button
                        onClick={() => handleDelete(index)}
                        type="button"
                        className="bg-zinc-900 text-zinc-200 py-2 mx-4 px-4 border border-zinc-700 rounded-md shadow-sm text-sm font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        Delete
                      </button>
                    </div>
                  </div>
                )) ?? []}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="ml-0 inline-flex justify-center my-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  Add social profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 border-y-1 border-zinc-700/40">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Save
            </button>
          </div>
        </div>
      </form>
    </container>
  );
}
